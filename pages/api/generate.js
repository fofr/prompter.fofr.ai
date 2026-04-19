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
  const generatedPrompts = [];
  for (let i = 0; i < count; i++) {
    generatedPrompts.push(generate(promptTemplate));
  }

  res.status(200).json({ prompts: generatedPrompts });
}
