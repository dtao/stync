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
  // to the same line. Subsequent messages are queued up so that they will not
  // print until this message is finished.
  var message = stync.begin('Fetching "' + url + '"...');

  var request = http.get(url, function(response) {
    // message.write adds more text to the current line, without progressing to
    // the next message in the queue.
    message.write(' received response (' + response.statusCode + ')...');

    var bytesReceived = 0;

    response.on('data', function(data) {
      bytesReceived += data.length;
    });

    response.on('end', function(data) {
      // message.end terminates the current line. Any subsequent lines (that you
      // started w/ stync.begin) will now be written, when ready, in the order
      // in which they were enqueued.
      message.end(' read ' + bytesReceived + ' bytes');
    });
  });

  request.on('error', function(err) {
    message.end(' ' + err);
  });
});
