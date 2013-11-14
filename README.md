stync
=====

Ever have this happen? You've got a bunch of asynchronous code that includes calls to `console.log` (or `process.stdout.write`); and it gets all jumbled because your callbacks fire in non-deterministic order.

This is just a little library to make things a bit more orderly.

Usage
-----

```javascript
var async = require('async'),
    http  = require('http'),
    stync = require('stync');

var urls = [
  "http://www.google.com",
  "http://www.yahoo.com",
  "http://www.amazon.com",
  "http://www.stackoverflow.com",
  "http://www.reddit.com",
  "http://www.github.com"
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
```

In the above example, all URLs are requested in parallel. Suppose a response is received from the last URL first. Everything will still display properly because each `message` does not write itself to `process.stdout` until its predecessor has called `end`. In effect, messages "wait their turn" so that line-by-line the console output makes sense.
