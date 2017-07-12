#!/usr/bin/env node --harmony

const program = require('vorpal')();
const Blockchain = require('./chain/Blockchain.js');
const ChainManager = require('./chain/ChainManager');
const net = require('net');
const p2p = require('./p2p.js');

program
  .command('blockchain', 'blockchain output')
  .alias('bc')
  .action((args, callback) => {
    console.log(Blockchain);
    callback();
  })

program
  .command('mine [data...]', 'mine a new block')
  .alias('m')
  .action((args, callback) => {
    if (args.data) {
      const newBlock = ChainManager.generateNextBlock(args.data, Blockchain);
      ChainManager.addBlock(newBlock, Blockchain);
      broadcast(responseLatestMsg());
      console.log(`Successfully added ${args.data} to the blockchain`);
    }
    callback();
  })

program
  .command('peers', 'connected peers')
  .alias('p')
  .action((args, callback) => {
    console.log(p2p.peers);
    callback();
  })

program
  .command('connect [peer...]', "connect to a new peer")
  .alias('c')
  .action((args, callback) => {
    console.log(args);
    if (args.peer) {
      const peerIp = args.peer[0].split(":")
      const hostname = peerIp[0];
      const port = peerIp[1];
      const socket = net.connect(port, hostname, () => p2p.connect(socket, (err, connection) => {
        connection.write(new Buffer('hey'));
      }));
    }
    callback();
  })

program
  .command("discover")
  .alias('d')
  .action((args, callback) => {
    p2p.getNewPeer((err) => {
      if (err) {
        console.log(err);
      }
    })
  })

program
  .command('open [port...]', 'Open port to accept incoming connections')
  .alias('o')
  .action((args, callback) => {
    if (args.port) {
      net.createServer(socket => p2p.accept(socket)).listen(args.port[0]);
    }
    callback();
  })

program
  .delimiter('uNode')
  .show();


