const p2p = require('../../p2p');

module.exports = function (vorpal) {
  vorpal
    .command('connect <host> <port>', "Connect to a new peer. Eg: connect localhost 2727")
    .alias('c')
    .action(function(args, callback) {
      if(args.host && args.port) {
        p2p.connectToPeer(args.host, args.port);
      }
      callback();
    })
}