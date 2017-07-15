const figlet = require('figlet');

module.exports = function (vorpal) {
  vorpal
    .log(figlet.textSync('blockchain.js', {
      font: 'Big',
      horizontalLayout: 'default',
      verticalLayout: 'default'
    }))
}