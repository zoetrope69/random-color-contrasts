const { drawImage } = require("./images");
const { sendImageToMastodon } = require("./mastodon");
const { getColorCombo } = require("./colors");

function generateRandomColorContrast({ imageFilePath }) {  
  return getColorCombo()
    .then(data => {
      const { colorOne, colorTwo } = data;

      const text = [
        `${colorOne.name} ${colorOne.hex}`,
        `${colorTwo.name} ${colorTwo.hex}`,
        ``,
        `(Contrast ratio: ${data.ratio.toFixed(1)}:1 | ${data.score})`
      ].join("\n");
      const imageDescription = `${colorOne.name} (${colorOne.hex}) and ${colorTwo.name} (${colorTwo.hex})`;

      return drawImage(imageFilePath, data).then(() => {
        return sendImageToMastodon(imageFilePath, imageDescription, text);
      });
    })
    .catch(error => {
      console.error("error:", error);
    });
}

module.exports = generateRandomColorContrast;
