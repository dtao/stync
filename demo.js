var async = require('async'),
    http  = require('http'),
    stync = require('stync');

var urls = [
  "http://www.google.com",
  "http://www.yahoo.com",
  "http://www.amazon.com",
  "http://www.stackoverflow.com",
  "http://www.reddit.com",
  "http://www.github.com",
  "invalid URL"
];

async.each(urls, function(url) {
  // stync.begin indicates you're starting a new line in your output;
  // it returns a message object that you can use to continue writing
  // to the same line
  var message = stync.begin('Fetching ' + url + '...');

  var request = http.get(url, function(response) {
    // ...message.write adds more text to the current line...
    message.write(' received response (' + response.statusCode + ')...');

    var bytesReceived = 0;

    response.on('data', function(data) {
      bytesReceived += data.length;
    });

    response.on('end', function(data) {
      // ...and message.end terminates the current line.
      // Any subsequent lines (that you started w/ stync.begin) will now be
      // written, when ready, in the order in which you created them
      message.end(' Finished: ' + bytesReceived + ' bytes');
    });
  });
});
