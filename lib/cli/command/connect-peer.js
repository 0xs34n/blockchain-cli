const p2p = require('../../p2p');

module.exports = function (vorpal) {
  vorpal
    .command('connect [peer...]', "connect to a new peer")
    .alias('c')
    .action(function(args, callback) {
      if(args.peer) {
        p2p.connectToPeer(args.peer[0]);
      }
      callback();
    })
}