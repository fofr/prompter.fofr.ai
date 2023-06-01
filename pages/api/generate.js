import { callLists } from "./_all-lists"

export default async function handler(req, res) {
  const promptTemplate = req.body.prompt;
  const generatedPrompt = promptTemplate
    .replace(/\[(.*?)\]/g, (_match, listName) => {
      if (!callLists[listName]) {
        return `[${listName}]`
      }
      return callLists[listName](1);
    });

  res.status(200).json(generatedPrompt);
}
