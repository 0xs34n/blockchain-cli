let logger;

if (process.env.NODE_ENV === "test") {
  logger = {
    debug: function(message) { },
    log: function(message) { },
    info: function(message) { },
    confirm: function(message) { },
    warn: function(message) { },
    error: function(message) { },
    fatal: function(message) { }
  };
} else {
  logger = require('vorpal')();
}

module.exports = logger;