const figlet = require('figlet');
const logger = require('./logger.js');

module.exports = function (vorpal) {
  logger.printMsg(figlet.textSync('blockchain.js', {
      font: 'Big',
      horizontalLayout: 'default',
      verticalLayout: 'default'
  }))
}