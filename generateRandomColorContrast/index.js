const { drawImage } = require("./images");
const { sendImageToMastodon } = require("./mastodon");
const { getColors } = require("./colors");

function generateRandomColorContrast({ imageFilePath }) {  
  const colors = getColors();
  const { colorOne, colorTwo, ratio, score } = colors;

  const text = [
    `${colorOne.name} ${colorOne.hex}`,
    `${colorTwo.name} ${colorTwo.hex}`,
    ``,
    `(Contrast ratio: ${ratio.toFixed(1)}:1 | ${score})`
  ].join("\n");
  const imageDescription = `${colorOne.name} (${colorOne.hex}) and ${colorTwo.name} (${colorTwo.hex})`;

  return drawImage(imageFilePath, colors).then(() => {
    return sendImageToMastodon(imageFilePath, imageDescription, text);
  });
}

module.exports = generateRandomColorContrast;
