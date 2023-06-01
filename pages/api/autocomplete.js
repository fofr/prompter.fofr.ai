import listHelpers from "prompt-lists"
const allLists = [];
for (const category of Object.keys(listHelpers)) {
  for (const listName of Object.keys(listHelpers[category])) {
    allLists.push(`${category}.${listName}`)
  }
}

export default async function handler(req, res) {
  const token = req.query.token;
  const filteredLists = token
    ? allLists.filter(list => list.toLowerCase().startsWith(token.toLowerCase()))
    : allLists;

  res.status(200).json(filteredLists);
}
