var stync = { out: process.stdout };

stync.List = function() {
};

stync.List.prototype.push = function(line) {
  if (!this.tail) {
    this.head = this.tail = line;
  } else {
    this.tail.next = line;
    this.tail = line;
  }
};

stync.List.prototype.shift = function() {
  var head = this.head;

  if (!head) {
    return null;
  }

  this.head = head.next;
  return head;
};

stync.lines = new stync.List();

stync.Line = function(message) {
  this.message = message;
};

stync.begin = function(message) {
  var line = new stync.Line(message);
  stync.lines.push(line);
  if (line === stync.lines.head) {
    stync.out.write(message);
  }
  return line;
};

stync.write = function(message) {
  stync.begin(message).end();
};

stync.Line.prototype.write = function(text) {
  this.message += text;
  if (this === stync.lines.head) {
    stync.out.write(text);
  }
};

stync.Line.prototype.end = function(text) {
  text = text || '';

  this.message += text;
  this.ended = true;

  var head = stync.lines.head;
  if (this === head) {
    stync.out.write(text + '\n');
    stync.lines.shift();

    head = stync.lines.head;
    while (head && head.ended) {
      stync.out.write(head.message + '\n');
      stync.lines.shift();
      head = stync.lines.head;
    }

    if (head) {
      stync.out.write(head.message);
    }
  }
};

module.exports = stync;
