const p2p = require('../../p2p');

module.exports = function (vorpal) {
  vorpal
    .command('open [port...]', 'Open port to accept incoming connections. Example: open 2700')
    .alias('o')
    .action(function(args, callback) {
      if (args.port) {
        p2p.startServer(args.port[0]);
      }
      callback();
    })
}