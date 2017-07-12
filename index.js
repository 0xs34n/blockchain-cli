const CryptoJS = require("crypto-js");
const express = require("express");
const bodyParser = require('body-parser');
const WebSocket = require("ws");

http_port = process.env.HTTP_PORT || 3001;
p2p_port = process.env.P2P_PORT || 6001;
initialPeers = process.env.PEERS ? process.env.PEERS.split(',') : [];

class Block {
  constructor(index, previousHash, timestamp, data, hash) {
    this.index = index;
    this.previousHash = previousHash.toString();
    this.timestamp = timestamp;
    this.data = data;
    this.hash = hash.toString();
  }
}

const sockets = [];
const MessageType = {
  QUERY_LATEST: 0,
  QUERY_ALL: 1,
  RESPONSE_BLOCKCHAIN: 2
}

function getGenesisBlock() {
  return new Block(
    0,
    "0",
    1277777777,
    "Welcome to my blockchain!",
    "816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7"
  )
}

const blockchain = [getGenesisBlock()];

function initHttpServer() {
  const app = express();
  app.use(bodyParser.json());

  app.get('/blocks', (req, res) => res.send(JSON.stringify(blockchain)));
  app.post('/mineBlock', (req, res) => {
    const newBlock = generateNextBlock(req.body.data);
    addBlock(newBlock);
    broadcast(responseLatestMsg());
    console.log('New block added: ', JSON.stringify(newBlock));
    res.send();
  });
  app.get('/peers', (req, res) => {
    res.send(sockets.map(s => s._socket.remoteAddress + ':' + s._socket.remotePort));
  });
  app.post('/addPeer', (req, res) => {
    connectToPeers([req.body.peer]);
    res.send();
  })
  app.listen(http_port, () => console.log(`Listening to http on port: ${http_port}`));
}

function initP2PServer() {
  const server = new WebSocket.Server({ port: p2p_port });
  server.on('connection', ws => initConnection(ws));
  console.log('Listening websocket p2p port on: ', p2p_port);
};

function initConnection(ws){
  sockets.push(ws);
  initMessageHandler(ws);
  initErrorHandler(ws);
  write(ws, queryChainLengthMsg());
}

function initMessageHandler(ws) {
  ws.on('message', (data) => {
    const message = JSON.parse(data);
    console.log('Received Message: ' + JSON.stringify(message));
    switch(message.type) {
      case MessageType.QUERY_LATEST:
        write(ws, responseLatestMsg());
        break;
      case MessageType.QUERY_ALL:
        write(ws, responseChainMsg());
        break;
      case MessageType.RESPONSE_BLOCKCHAIN:
        handleBlockchainResponse(message);
        break;
    }
  });
};

function initErrorHandler(ws) {
  function closeConnection(ws) {
    console.log('Connection failed to peer: ' + ws.url);
    sockets.splice(sockets.indexOf(ws), 1);
  }

  ws.on('close', () => closeConnection(ws));
  ws.on('error', () => closeConnection(ws));
}

function generateNextBlock(blockData) {
  const previousBlock = getLatestBlock();
  const nextIndex = previousBlock.index + 1;
  const nextTimestamp = new Date().getTime() / 1000;
  const nextHash = calculateHash(nextIndex, previousBlock.hash, nextTimestamp, blockData);
  return new Block(nextIndex, previousBlock.hash, nextTimestamp, blockData, nextHash);
}

function calculateHashForBlock(block) {
  return calculateHash(block.index, block.previousHash, block.timestamp, block.data);
}

function calculateHash(index, previousHash, timestamp, data) {
  return CryptoJS.SHA256(index + previousHash + timestamp + data).toString();
}

function addBlock(newBlock) {
  if (isValidNewBlock(newBlock, getLatestBlock())) {
    blockchain.push(newBlock);
  }
}

function isValidNewBlock(newBlock, previousBlock) {
  if (previousBlock.index + 1 !== newBlock.index) {
    console.log('invalid index');
    return false;
  } else if (previousBlock.hash !== newBlock.previousHash) {
    console.log('Invalid previous hash!');
    return false;
  } else if (calculateHashForBlock(newBlock) !== newBlock.hash) {
    console.log(typeof (newBlock.hash) + ' ' + typeof calculateHashForBlock(newBlock));
    console.log('invalid hash: ' + calculateHashForBlock(newBlock) + ' ' + newBlock.hash);
    return false;
  }
  return true;
}

function connectToPeers(newPeers) {
  newPeers.forEach(peer => {
    const ws = new WebSocket(peer);
    ws.on('open', () => initConnection(ws));
    ws.on('error', () => {
      console.log('Connection failed!');
    })
  })
}


function handleBlockchainResponse(message) {
  const receivedBlocks = JSON.parse(message.data).sort((b1, b2) => (b1.index - b2.index));
  const latestBlockReceived = receivedBlocks[receivedBlocks.length - 1];
  const latestBlockHeld = getLatestBlock();
  if (latestBlockReceived.index > latestBlockHeld.index) {
    console.log('blockchain possibly behind. We got: ' + latestBlockHeld.index + ' Peer got: ' + latestBlockReceived.index);
    if (latestBlockHeld.hash === latestBlockReceived.previousHash) {
      console.log("We can append the received block to our chain");
      blockchain.push(latestBlockReceived);
      broadcast(responseLatestMsg());
    } else if (receivedBlocks.length === 1) {
      console.log("We have to query the chain from our peer");
      broadcast(queryAllMsg());
    } else {
      console.log("Received blockchain is longer than current blockchain");
      replaceChain(receivedBlocks);
    }
  } else {
    console.log('received blockchain is not longer than received blockchain. Do nothing');
  }
}

function replaceChain(newBlocks) {
  if (isValidChain(newBlocks) && newBlocks.length > blockchain.length) {
    console.log('Received blockchain is valid. Replacing current blockchain with received blockchain');
    blockchain = newBlocks;
    broadcast(responseLatestMsg());
  } else {
    console.log('Received blockchain invalid!')
  }
}

function isValidChain(blockchainToValidate) {
  if (JSON.stringify(blockchainToValidate[0]) !== JSON.stringify(getGenesisBlock())) {
    return false;
  }
  const tempBlocks = [blockchainToValidate[0]];
  for (let i = 0; i < blockchainToValidate.length; i++) {
    if(isValidNewBlock(blockchainToValidate[i], tempBlocks[i - 1])) {
      tempBlocks.push(blockchainToValidate[i]);
    } else {
      return false;
    }
  }
}

function getLatestBlock() {
  return blockchain[blockchain.length - 1];
}

function queryChainLengthMsg() {
  return {
    type: MessageType.QUERY_LATEST
  }
}

function queryAllMsg() {
  return {
    type: MessageType.QUERY_ALL
  }
}

function responseChainMsg() {
  return {
    type: MessageType.RESPONSE_BLOCKCHAIN, 
    data: JSON.stringify(blockchain)
  }
}

function responseLatestMsg() {
  return {
    type: MessageType.RESPONSE_BLOCKCHAIN,
    data: JSON.stringify([getLatestBlock()])
  }
}

function write(ws, message) {
  return ws.send(JSON.stringify(message));
}

function broadcast(message) {
  return sockets.forEach(socket => write(socket, message));
}

connectToPeers(initialPeers);
initHttpServer();
initP2PServer();
