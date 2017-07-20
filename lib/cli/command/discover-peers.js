const p2p = require('../../p2p');

module.exports = function (vorpal) {
  vorpal
    .command('discover', 'Discover new peers from your connected peers.')
    .alias('d')
    .action(function(args, callback) {
      p2p.discoverPeers();
      callback();
    })
}