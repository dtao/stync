var async = require('async'),
    http  = require('http'),
    stync = require('./stync');

var urls = [
  "http://www.google.com",
  "http://www.yahoo.com",
  "http://www.amazon.com",
  "http://www.stackoverflow.com",
  "http://www.reddit.com",
  "http://www.github.com"
];

async.each(urls, function(url) {
  var message = stync.begin('Fetching ' + url + '...');

  var request = http.get(url, function(response) {
    message.write(' received response (' + response.statusCode + ')...');

    var bytesReceived = 0;

    response.on('data', function(data) {
      bytesReceived += data.length;
    });

    response.on('end', function(data) {
      message.end(' Finished: ' + bytesReceived + ' bytes');
    });
  });
});
