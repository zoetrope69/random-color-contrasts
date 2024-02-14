const contrast = require("get-contrast");
const colorNamer = require("color-namer");
const randomColor = require("random-hex-color");

/*
  colors to block for various reasons, for example this one:
  https://botsin.space/@accessibleColors/101967888732908331

  for example in .env use:
  COLOR_BLOCKLIST='["flesh"]'
  
  this will skip this color name and try another one
  
  we'll put in in .env just incase there are words you'd rather not read
  in source code...
*/
const COLOR_BLOCKLIST = JSON.parse(process.env.COLOR_BLOCKLIST);

function colorIsBlocked(str) {
  return COLOR_BLOCKLIST.includes(str.toLowerCase());
}

function toTitleCase(str) {
  return str.replace(/\w\S*/g, txt => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

// stolen from https://github.com/components-ai/randoma11y
function getColorPair(pinnedColor) {
  const colorOne = pinnedColor || randomColor();
  let colorTwo = randomColor();

  while (!contrast.isAccessible(colorOne, colorTwo)) {
    colorTwo = randomColor();
  }

  return { colorOne, colorTwo };
}

function getClosestName(color) {
  const names = colorNamer(color);

  if (!names) {
    return null;
  }

  const possibleColors = [];

  if (names.pantone[0]) {
    possibleColors.push(names.pantone[0]);
  }

  if (names.ntc[0]) {
    possibleColors.push(names.ntc[0]);
  }

  if (names.roygbiv[0]) {
    possibleColors.push(names.roygbiv[0]);
  }

  // filter out blocked colors
  const possibleColorsWithBlockedColors = possibleColors.filter(
    color => !colorIsBlocked(color.name)
  );

  if (possibleColorsWithBlockedColors.length === 0) {
    return null;
  }

  const sortedByDistancePossibleColors = possibleColorsWithBlockedColors.sort(
    (a, b) => a.distance - b.distance
  );

  const [closestMatchedColor] = sortedByDistancePossibleColors;

  return toTitleCase(closestMatchedColor.name);
}

function getColors() {
  const { colorOne, colorTwo } = getColorPair();

  return {
    colorOne: {
      hex: colorOne.toUpperCase(),
      name: getClosestName(colorOne)
    },
    colorTwo: {
      hex: colorTwo.toUpperCase(),
      name: getClosestName(colorTwo)
    },
    ratio: contrast.ratio(colorOne, colorTwo),
    score: contrast.score(colorOne, colorTwo)
  };
}

module.exports = {
  getColors
};
