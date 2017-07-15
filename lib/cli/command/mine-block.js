const blockchain = require('../../blockchain');
const p2p = require('../../p2p');

module.exports = function (vorpal) {
  vorpal
    .command('mine [data...]', 'mine a new block')
    .alias('m')
    .action(function(args, callback) {
      if (args.data) {
        blockchain.mine(args.data[0]);
        p2p.broadcastLatest(); 
        this.log(`block added: ${args.data}`);
      }
      callback();
    })
}