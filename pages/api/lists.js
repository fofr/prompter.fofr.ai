import listHelpers from "prompt-lists"

const toTitleCase = (str) => {
  return str
    .replace(/([a-z\xE0-\xFF])([A-Z\xC0\xDF])/g, "$1 $2")
    .replace(/^./, function (str) {
      return str.toUpperCase();
    });
};

export default async function handler(_req, res) {
  const lists = {};
  for (const category of Object.keys(listHelpers)) {
    const categoryTitle = toTitleCase(category);
    lists[categoryTitle] = [];
    Object.keys(listHelpers[category]).map((key, list) => (
      lists[categoryTitle].push({
        title: toTitleCase(key),
        value: `${category}.${key}`
      })
    ));
  }

  res.status(200).json(lists);
}
