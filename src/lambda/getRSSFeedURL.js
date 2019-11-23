// 'use strict';

const cheerio = require("cheerio");
const request = require("request");

export function handler(event, context, callback) {
  const data = JSON.parse(event.body);
  const baseURL = data.url;

  request(baseURL, function(err, response, body) {
    if (!err && response.statusCode === 200) {
      const $ = cheerio.load(body);

      var feedUrl = $('link[type="application/rss+xml"]').attr("href");
      return callback(null, {
        statusCode: 200,
        headers: {
          "Content-Type": "text/plain",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers":
            "Origin, X-Requested-With, Content-Type, Accept"
        },
        body: feedUrl
      });
    } else {
      return callback(null, {
        statusCode: 404,
        body: err
      });
    }
  });
}
