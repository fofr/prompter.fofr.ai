import { callLists } from "./_all-lists"

const generate = (promptTemplate) => {
  return promptTemplate
    .replace(/\[(.*?)\]/g, (_match, listName) => {
      if (!callLists[listName]) {
        return `[${listName}]`
      }
      return callLists[listName](1);
    });
}

export default async function handler(req, res) {
  const promptTemplate = req.body.promptTemplate;
  const count = req.body.count || 1;
  const generatedPrompts = [];
  for (let i = 0; i < count; i++) {
    generatedPrompts.push(generate(promptTemplate));
  }

  res.status(200).json(generatedPrompts);
}
