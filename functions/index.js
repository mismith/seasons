const functions = require('firebase-functions');
const scrapeEvents = require('./scrapeEvents');

exports.scrapeEvents = functions.https.onRequest((req, res) => {
  const year = req.query.year || new Date().getFullYear();
  scrapeEvents(year)
    .then(data => {
      res.json(data);
    });
});
