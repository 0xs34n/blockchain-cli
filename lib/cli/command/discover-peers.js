const p2p = require('../../p2p');

module.exports = function (vorpal) {
  vorpal
    .command('discover', 'discover new peers from your current peers')
    .alias('d')
    .action(function(args, callback) {
      if (args.data) {
        blockchain.mine(args.data[0]);
        p2p.broadcastLatest(); 
        this.log(`block added: ${args.data}`);
      }
      callback();
    })
}

//   cli
//     .command("discover", "discover new peers from your current network")
//     .alias('d')
//     .action(function(args, callback) {
//       p2p.getNewPeer((err) => {
//         if (err) {
//           cli.log(err);
//         }
//       })
//     })