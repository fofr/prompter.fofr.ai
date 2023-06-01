import { allLists } from "./_all-lists"

export default async function handler(req, res) {
  const token = req.query.token;
  const filteredLists = token
    ? allLists.filter(list => list.toLowerCase().includes(token.toLowerCase()))
    : allLists;

  res.status(200).json(filteredLists);
}
