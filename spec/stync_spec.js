var stync = require('../stync');
            require('should');

describe('stync', function() {
  stync.out = new function TestOutput() {
    this.text = '';

    this.write = function(message) {
      this.text += message;
    };

    this.lines = function() {
      var lines = this.text.split('\n'), lastLine;

      // Remove the last line, if it's blank
      if ((lastLine = lines.pop()) !== '') {
        lines.push(lastLine);
      }

      return lines;
    };
  };

  beforeEach(function() {
    stync.out.text = '';
    stync.reset();
  });

  it('queues up subsequent calls to begin', function() {
    var foo = stync.begin('foo'),
        bar = stync.begin('bar');
    foo.end('1');
    bar.end('2');

    stync.out.lines().should.eql([
      'foo1',
      'bar2'
    ]);
  });

  it('does not output a line until the previous line is ended', function() {
    var foo = stync.begin('foo'),
        bar = stync.begin('bar');
    bar.end('2');

    stync.out.lines().should.eql(['foo']);
  });

  it('immediately flushes calls to write', function() {
    stync.write('foo1');
    stync.write('bar2');

    stync.out.lines().should.eql([
      'foo1',
      'bar2'
    ]);
  });
});
