stync
=====

Ever have this happen? You've got a bunch of asynchronous code that includes logging, and it gets all jumbled because your callbacks fire in non-deterministic order?

This is just a little library to make things a little bit more orderly.

Usage
-----

```
var stync = require('stync');

doInParallel([url1, url2, url3], function(url) {
  var message = stync.begin('Fetching ' + url + '...');

  fetchUrl(url, function(response) {
    message.write(' received response...');

    response.readAsync(function(data) {
      message.end(' Finished!');
    });
  });
});
```

In the above example, suppose the three URLs are requested in order, and a response is received from the last URL first. Everything will still display properly because each `message` does not write itself to `process.stdout` until its predecessor has called `end`. In effect, messages "wait their turn" so that line-by-line the console output makes sense.
