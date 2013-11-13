var stync = {
  /**
   * Where output should go. Defaults to `process.stdout`.
   */
  out: process.stdout
};

/**
 * A linked list of {@link stync.Line}s, basically.
 */
stync.List = function() {
};

/**
 * Adds a new line to the end of the list.
 */
stync.List.prototype.push = function(line) {
  if (!this.tail) {
    this.head = this.tail = line;
  } else {
    this.tail.next = line;
    this.tail = line;
  }
};

/**
 * Removes and returns the first line in the list.
 */
stync.List.prototype.shift = function() {
  var head = this.head;

  if (!head) {
    return null;
  }

  this.head = head.next;
  return head;
};

/**
 * A {@link stync.List} containing all of the lines being buffered.
 */
stync.lines = new stync.List();

/**
 * A line of text.
 */
stync.Line = function(message) {
  this.message = message;
};

/**
 * Starts a new line that will be output to {@link stync.out} once its turn has
 * come. Returns a {@link stync.Line}.
 */
stync.begin = function(message) {
  var line = new stync.Line(message);
  stync.lines.push(line);
  if (line === stync.lines.head) {
    stync.out.write(message);
  }
  return line;
};

/**
 * Adds a new, complete line to {@link stync.out}.
 */
stync.write = function(message) {
  stync.begin(message).end();
};

/**
 * Adds text to the line. If this line is the current line, the text will be
 * output to {@link stync.out} immediately.
 */
stync.Line.prototype.write = function(text) {
  this.message += text;
  if (this === stync.lines.head) {
    stync.out.write(text);
  }
};

/**
 * Ends the line. This will output any remaining text to {@link stync.out} and
 * proceed to output any subsequent lines that are ready to print.
 */
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
