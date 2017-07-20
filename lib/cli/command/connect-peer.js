const p2p = require('../../p2p');

module.exports = function (vorpal) {
  vorpal
    .command('connect [peer...]', "Connect to a new peer. Example: connect localhost:2700")
    .alias('c')
    .action(function(args, callback) {
      if(args.peer) {
        p2p.connectToPeer(args.peer[0]);
      }
      callback();
    })
}