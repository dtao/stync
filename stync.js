var stync = {
  /**
   * Current stync version (duh).
   */
  VERSION: '0.1.2',

  /**
   * Where output should go. Defaults to `process.stdout`.
   */
  out: process.stdout
};

/**
 * A linked list of {@link stync.Message}s, basically.
 */
stync.Queue = function() {
};

/**
 * Adds a new {@link stync.Message} to the tail of the queue.
 */
stync.Queue.prototype.push = function(line) {
  if (!this.head) {
    this.head = this.tail = line;
  } else {
    this.tail.next = line;
    this.tail = line;
  }
};

/**
 * Removes and returns the {@link stync.Message} from the head of the queue.
 */
stync.Queue.prototype.shift = function() {
  var head = this.head;

  if (!head) {
    return null;
  }

  this.head = head.next;
  return head;
};

/**
 * A {@link stync.Queue} containing all of the messages being buffered.
 */
stync.messages = new stync.Queue();

/**
 * A message to (sooner or later) print to {@link stync.out}.
 */
stync.Message = function(text) {
  this.text = text;
};

/**
 * Starts a new message that will print to {@link stync.out} once it reaches the
 * head of the queue. Returns a {@link stync.Message}.
 */
stync.begin = function(text) {
  var message = new stync.Message(text);
  stync.messages.push(message);
  if (message === stync.messages.head) {
    stync.out.write(text);
  }
  return message;
};

/**
 * Adds a new, ready-to-print {@link stync.Message} to the queue.
 */
stync.write = function(text) {
  stync.begin(text).end();
};

/**
 * Empties the queue, effectively starting over.
 */
stync.reset = function() {
  stync.messages = new stync.Queue();
};

/**
 * Adds text to the message. If this message is at the head of the queue, the
 * text will print to {@link stync.out} immediately.
 */
stync.Message.prototype.write = function(text) {
  this.text += text;
  if (this === stync.messages.head) {
    stync.out.write(text);
  }
};

/**
 * Ends the message. This will output the specified text to {@link stync.out}
 * and proceed to the next message in the queue, continuing to print messages as
 * they are completed.
 */
stync.Message.prototype.end = function(text) {
  text = text || '';

  this.text += text;
  this.ended = true;

  var head = stync.messages.head;
  if (this === head) {
    stync.out.write(text + '\n');
    stync.messages.shift();

    head = stync.messages.head;
    while (head && head.ended) {
      stync.out.write(head.text + '\n');
      stync.messages.shift();
      head = stync.messages.head;
    }

    if (head) {
      stync.out.write(head.text);
    }
  }
};

module.exports = stync;
