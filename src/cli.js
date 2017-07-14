#!/usr/bin/env node --harmony

const program = require('vorpal')();
const figlet = require('figlet');
const Blockchain = require('./chain/Blockchain.js');
const generateNextBlock = require('./chain/ChainManager').generateNextBlock;
const addBlock = require('./chain/ChainManager').addBlock;
const net = require('net');
const p2p = require('./p2p.js').p2p;
const broadcast = require('./p2p.js').broadcast;
const responseLatestMsg = require('./p2p.js').responseLatestMsg;
const queryChainLengthMsg = require('./p2p.js').queryChainLengthMsg;
const onData = require('./p2p.js').onData;
const addPeer = require('./p2p.js').addPeer;

program.log(figlet.textSync('Blockchain.js', {
    font: 'Big',
    horizontalLayout: 'default',
    verticalLayout: 'default'
}));

program
  .delimiter('Blockchain.js →')
  .show()

program
  .command('blockchain', 'blockchain output')
  .alias('bc')
  .action((args, callback) => {
    program.log(Blockchain);
    callback();
  })

program
  .command('mine [data...]', 'mine a new block')
  .alias('m')
  .action(function(args, callback) {
    if (args.data) {
      const newBlock = generateNextBlock(args.data, Blockchain);
      addBlock(newBlock, Blockchain);
      broadcast(JSON.stringify(responseLatestMsg(Blockchain)))
      program.log(`Successfully added ${args.data} to the blockchain`);
    }
    callback();
  })

program
  .command('peers', 'connected peers')
  .alias('p')
  .action(function(args, callback) {
    program.log(peers);
    callback();
  })

program
  .command('connect [peer...]', "connect to a new peer")
  .alias('c')
  .action(function(args, callback) {
    if (args.peer) {
      const peerIp = args.peer[0].split(":")
      const hostname = peerIp[0];
      const port = peerIp[1];
      const socket = net.connect(port, hostname, () => p2p.connect(socket, (err, connection) => {
        program.log(`Successfully connect to new peer ${args.peer[0]}.`);
        onData(err, connection, Blockchain);
        addPeer(connection);
        connection.write(JSON.stringify(queryChainLengthMsg()));
      }));
    }
    callback();
  })

program
  .command("discover", "discover new peers from your current network")
  .alias('d')
  .action(function(args, callback) {
    p2p.getNewPeer((err) => {
      if (err) {
        program.log(err);
      }
    })
  })

program
  .command('open [port...]', 'Open port to accept incoming connections')
  .alias('o')
  .action(function(args, callback) {
    if (args.port) {
      net.createServer(function(socket) {
        p2p.accept(socket, function(err, connection) {
          program.log('Accepted new incoming peer.');
          onData(err, connection, Blockchain);
          addPeer(connection);
        })
      }).listen(args.port[0]);
    }
    callback();
  })

module.exports = program;