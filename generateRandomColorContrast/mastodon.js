const { MASTODON_ACCESS_TOKEN, MASTODON_API_URL } = process.env;

if (!MASTODON_ACCESS_TOKEN || !MASTODON_API_URL) {
  console.error("Missing environment variables from Mastodon. See README");
  process.exit(1);
}

const fs = require("fs");
const Mastodon = require("mastodon-api");
const mastodonClient = new Mastodon({
  access_token: MASTODON_ACCESS_TOKEN,
  timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
  api_url: MASTODON_API_URL
});

function sendImageToMastodon(imageFilePath, imageDescription, text) {
  return uploadImage(imageFilePath, imageDescription).then(imageId => {
    createStatus(imageId, text);
  });
}

function createStatus(mediaIdStr, status) {
  return new Promise((resolve, reject) => {
    const params = { status, media_ids: [mediaIdStr] };
    return mastodonClient.post("statuses", params, (err, data, response) => {
      if (err) {
        return reject(err);
      }

      return resolve();
    });
  });
}

function uploadImage(filePath, description) {
  return new Promise((resolve, reject) => {
    const params = { file: fs.createReadStream(filePath), description };
    return mastodonClient.post("media", params, (err, data, response) => {
      if (err) {
        return reject(err);
      }

      if (!data.id) {
        return reject("No media ID to use for toot");
      }

      return resolve(data.id);
    });
  });
}

module.exports = {
  sendImageToMastodon
};
