import db from "../../lib/db";
import { callLists } from "./_all-lists"

const generate = (promptTemplate) => {
  return promptTemplate
    .replace(/\[(.*?)\]/g, (_match, listName) => {
      let listNameParts = listName.split(',');
      listName = listNameParts[0].trim();
      let itemCount = listNameParts.length === 2 ? parseInt(listNameParts[1]) : 1;
      itemCount = isNaN(itemCount) ? 1 : itemCount;
      itemCount = itemCount > 50 ? 50 : itemCount;

      if (listName === 'random') {
        let randomItems = [];
        for (let i = 0; i < itemCount; i++) {
          randomItems.push(getRandomList()(1));
        }
        return randomItems.join(', ');
      }

      if (!callLists[listName]) {
        return `[${listName}]`
      }

      return callLists[listName](itemCount).join(', ');
    });
}

const getRandomList = () => {
  const listNames = Object.keys(callLists);
  const randomListName = listNames[Math.floor(Math.random() * listNames.length)];
  return callLists[randomListName];
}

const saveTemplate = async (promptTemplate) => {
  // Call the stored procedure to increment 'count' and update 'last_used'.
  const { data: rpcData, error: rpcError } = await db
    .rpc('increment_template', {
      tmpl: promptTemplate
    })

  // If the stored procedure did not affect any rows, insert a new row.
  if (!rpcData || rpcData.length === 0) {
    const { data: insertData, error: insertError } = await db
      .from('generations')
      .insert({ template: promptTemplate })
      .select('id')

    if (insertError) {
      throw new Error(insertError.message);
    }

    return insertData[0].id;
  }

  if (rpcError) {
    throw new Error(rpcError.message);
  }

  return rpcData;
}

export default async function handler(req, res) {
  let promptTemplate, count;

  switch (req.method) {
    case 'POST':
      promptTemplate = req.body.promptTemplate;
      count = req.body.count || 1;
      break;
    case 'GET':
      promptTemplate = req.query.promptTemplate;
      count = req.query.count || 1;
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      return;
  }

  count = count > 1000 ? 1000 : count;

  console.info(`Generating: ${promptTemplate} (${count})`)
  let id = null;
  const generatedPrompts = [];
  for (let i = 0; i < count; i++) {
    generatedPrompts.push(generate(promptTemplate));
  }

  if (count > 1) {
    // Create a promise that rejects in <X> milliseconds
    const timeout = new Promise((_resolve, reject) => {
      const id = setTimeout(() => {
        clearTimeout(id);
        reject(new Error("Timed out"));
      }, 1000);
    });

    // Create a promise that saves the template and returns the id
    const saveTemplatePromise = saveTemplate(promptTemplate);

    try {
      id = await Promise.race([saveTemplatePromise, timeout]);
    } catch (error) {
      console.error('Database operation failed:', error);
      id = null;
    }
  }

  res.status(200).json({ id, prompts: generatedPrompts });
}
