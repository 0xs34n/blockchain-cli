const blockchain = require('../../blockchain');
const p2p = require('../../p2p');

module.exports = function (vorpal) {
  vorpal
    .command('mine <data>', 'Mine a new block. Eg: mine hello!')
    .alias('m')
    .action(function(args, callback) {
      if (args.data) {
        blockchain.mine(args.data);
        p2p.broadcastLatest(); 
      }
      callback();
    })
}