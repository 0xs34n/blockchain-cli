const p2p = require('../../p2p');

module.exports = function (vorpal) {
  vorpal
    .command('discover', 'discover new peers from your current peers')
    .alias('d')
    .action(function(args, callback) {
      p2p.discoverPeers();
      callback();
    })
}