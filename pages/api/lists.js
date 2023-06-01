import listHelpers from "prompt-lists"

const toTitleCase = (str) => {
  return str
    .replace(/([a-z\xE0-\xFF])([A-Z\xC0\xDF])/g, "$1 $2")
    .replace(/^./, function (str) {
      return str.toUpperCase();
    });
};

export default async function handler(_req, res) {
  const lists = {};  // Initialize an empty object to store your lists

  // Generate lists for each category
  for (const category of Object.keys(listHelpers)) {
    const categoryTitle = toTitleCase(category);
    lists[categoryTitle] = [];
    Object.keys(listHelpers[category]).map((key, list) => (
      lists[categoryTitle].push(toTitleCase(key))
    ));
  }

  res.status(200).json(lists);
}

// export default async function handler(req, res) {
//   console.log(lists)
//   res.status(200).json(lists)
// }
