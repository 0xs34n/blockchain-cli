const blockchain = require('../../blockchain');
const logBlockchain = require('../util/table.js');

module.exports = function (vorpal) {
  vorpal
    .command('blockchain', 'See the current state of the blockchain.')
    .alias('bc')
    .action(function(args, callback) {
      logBlockchain(blockchain.blockchain)
      callback();
    })
}