const fs = require("fs");
const Canvas = require("canvas");

function drawImage(filePath, colorData) {
  return new Promise((resolve, reject) => {
    const { colorOne, colorTwo } = colorData;

    const canvas = new Canvas(460, 260);
    const ctx = canvas.getContext("2d");

    ctx.antialias = "gray";

    function drawBox(y, colorA, colorB) {
      ctx.fillStyle = colorA.hex;
      ctx.fillRect(0, y, canvas.width, y + canvas.height / 2);

      ctx.fillStyle = colorB.hex;

      ctx.font = "semi-bold 20px Helvetica";
      const nameText = ctx.measureText(colorA.name);
      ctx.fillText(colorA.name, canvas.width / 2 - nameText.width / 2, y + 50);

      ctx.font = "bold 40px Helvetica";
      const hexText = ctx.measureText(colorA.hex);
      ctx.fillText(colorA.hex, canvas.width / 2 - hexText.width / 2, y + 95);
    }

    drawBox(0, colorOne, colorTwo);
    drawBox(canvas.height / 2, colorTwo, colorOne);

    fs.writeFile(filePath, canvas.toBuffer(), (err) => {
      if (err) {
        return reject(err);
      }

      resolve();
    });
  });
}

module.exports = {
  drawImage,
};
