const p2p = require('../../p2p');

module.exports = function (vorpal) {
  vorpal
    .command('peers', 'connected peers')
    .alias('p')
    .action(function(args, callback) {
      this.log(p2p.peers);
      callback();
    })
}