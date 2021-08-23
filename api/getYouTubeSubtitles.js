var youtube = require("youtube-captions-scraper");

module.exports = (req, response) => {
  const { id, lang } = req.query;
  youtube
    .getSubtitles({ videoID: id, lang: lang })
    .then(captions => {
      response.send(captions);
    })
    .catch(err => {
      response.status(403).send("Error!");
    });
};
