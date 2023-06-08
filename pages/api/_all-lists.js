import listHelpers from "prompt-lists"
const callLists = {};

for (const category of Object.keys(listHelpers)) {
  for (const listName of Object.keys(listHelpers[category])) {
    callLists[`${category}.${listName}`] = listHelpers[category][listName]
  }
}

export { callLists };
