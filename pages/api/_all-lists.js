import listHelpers from "prompt-lists"

const allLists = [];
const callLists = {};

for (const category of Object.keys(listHelpers)) {
  for (const listName of Object.keys(listHelpers[category])) {
    allLists.push(`${category}.${listName}`)
    callLists[`${category}.${listName}`] = listHelpers[category][listName]
  }
}

export { allLists, callLists };
