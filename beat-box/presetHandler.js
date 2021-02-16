// Use this presets array inside your presetHandler
const presets = require("./presets");

// Complete this function:
const presetHandler = (type, index, newPresetArray) => {
  let returnArray = [];
  if (type !== "GET" && type !== "PUT") {
    returnArray.push(400);
  } else if (index < 0 || index >= presets.length) {
    returnArray.push(404);
  } else {
    returnArray.push(200);
    if (type === "GET") {
      returnArray.push(presets[index]);
    } else if (type === "PUT") {
      presets[index] = newPresetArray;
      returnArray.push(newPresetArray);
    }
  }

  return returnArray;
};

// Leave this line so that your presetHandler function can be used elsewhere:
module.exports = presetHandler;
