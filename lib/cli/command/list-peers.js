const p2p = require('../../p2p');
const logger = require('../util/logger.js');

module.exports = function (vorpal) {
  vorpal
    .command('peers', 'Get the list of connected peers.')
    .alias('p')
    .action(function(args, callback) {
      p2p.peers.forEach(function(peer) {
        logger.log(`👤  ${peer.pxpPeer.socket._host} \n`)
      })
      callback();
    })
}