const vorpal = require('vorpal')();

module.exports = function (vorpal) {
  vorpal
    .use(require('./welcome.js'))
    .use(require('./command/list-blockchain.js'))
    .use(require('./command/mine-block.js'))
    .use(require('./command/list-peers.js'))
    .use(require('./command/discover-peers.js'))
    .use(require('./command/connect-peer.js'))
    .use(require('./command/open-port.js'))
    .delimiter('blockchain.js →')
    .show()
}




// function startCli(p2p, blockchain) {
//   cli.log(figlet.textSync('Blockchain.js', {
//       font: 'Big',
//       horizontalLayout: 'default',
//       verticalLayout: 'default'
//   }));

//   cli
//     .delimiter('Blockchain.js →')
//     .show()

//   cli
//     .command('blockchain', 'blockchain output')
//     .alias('bc')
//     .action(function(args, callback) {
//       cli.log(blockchain);
//       callback();
//     })

//   cli
//     .command('mine [data...]', 'mine a new block')
//     .alias('m')
//     .action(function(args, callback) {
//       if (args.data) {
//         const newBlock = generateNextBlock(args.data, Blockchain);
//         addBlock(newBlock, Blockchain);
//         broadcast(JSON.stringify(responseLatestMsg(Blockchain)))
//         cli.log(`Successfully added ${args.data} to the blockchain`);
//       }
//       callback();
//     })

//   cli
//     .command('peers', 'connected peers')
//     .alias('p')
//     .action(function(args, callback) {
//       cli.log(peers);
//       callback();
//     })

//   cli
//     .command('connect [peer...]', "connect to a new peer")
//     .alias('c')
//     .action(function(args, callback) {
//       if (args.peer) {
//         const peerIp = args.peer[0].split(":")
//         const hostname = peerIp[0];
//         const port = peerIp[1];
//         const socket = net.connect(port, hostname, () => p2p.connect(socket, (err, connection) => {
//           cli.log(`Successfully connect to new peer ${args.peer[0]}.`);
//           onData(err, connection, Blockchain);
//           addPeer(connection);
//           connection.write(JSON.stringify(queryChainLengthMsg()));
//         }));
//       }
//       callback();
//     })

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

//   cli
//     .command('open [port...]', 'Open port to accept incoming connections')
//     .alias('o')
//     .action(function(args, callback) {
//       if (args.port) {
//         net.createServer(function(socket) {
//           p2p.accept(socket, function(err, connection) {
//             cli.log('Accepted new incoming peer.');
//             onData(err, connection, Blockchain);
//             addPeer(connection);
//           })
//         }).listen(args.port[0]);
//       }
//       callback();
//     })
// }
