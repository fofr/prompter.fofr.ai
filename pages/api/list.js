import { callLists } from "./_all-lists"

export default async function handler(req, res) {
  if (!req.body.listName) {
    return res.status(400).json({ error: "Missing list" });
  }

  const listCall = callLists[req.body.listName];
  if (!listCall) {
    return res.status(400).json({ error: "Not a valid list" });
  }

  const list = listCall();

  list.length = list.list.length;
  const maxItemLength = Math.max(...list.list.map(item => item.length));

  if (maxItemLength > 40) {
    list.columnClasses = "grid-cols-1 md:grid-cols-2"
  } else if (maxItemLength > 20) {
    list.columnClasses = "grid-cols-1 md:grid-cols-3"
  } else {
    list.columnClasses = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
  }

  res.status(200).json(list);
}
