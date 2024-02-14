require('dotenv').config();

const { CronJob } = require("cron");
const express = require("express");
const app = express();

const generateRandomColorContrast = require('./generateRandomColorContrast');

// trigger every:
// 00:15, 04:15, 12:15, 16:15
const job = new CronJob("15 0,4,12,16 * * *", () => {
  console.log("Triggered cron job");
  
  console.log('Generating random color contrast...');
  const imageFilePath = `${__dirname}/public/output.png`;
  generateRandomColorContrast({ imageFilePath }).then(() => {
    console.log('Generated random color contrast and sent to Mastodon!');
  })
}, null, false, 'Europe/London');
job.start();

// glitch requires a server...
app.use(express.static("public"));

app.get("/", (_request, response) => {
  response.sendStatus(200);
});

const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});
