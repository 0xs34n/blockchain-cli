const Exchange = require('peer-exchange');
const program = require('vorpal')();
const wrtc = require('wrtc');
const p2p = new Exchange('uNode', { wrtc: wrtc });
const getLatestBlock = require('./chain/ChainManager.js').getLatestBlock;
const replaceChain = require('./chain/ChainManager.js').replaceChain;
const peers = [];

const MessageType = {
  QUERY_LATEST: 0,
  QUERY_ALL: 1,
  RESPONSE_BLOCKCHAIN: 2
}

function onData(err, connection, blockchain) {
  if (err) program.log(err);
  connection.on('data', data => {
    const message = JSON.parse(data.toString('utf8'));
    program.log('Received message: ', message);
    switch(message.type) {
      case MessageType.QUERY_LATEST:
        connection.write(JSON.stringify(responseLatestMsg(blockchain)));
        break;
      case MessageType.QUERY_ALL:
        connection.write(JSON.stringify(responseChainMsg(blockchain)));
        break;
      case MessageType.RESPONSE_BLOCKCHAIN:
        handleBlockchainResponse(message, blockchain);
        break;
    }
  })
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

function responseChainMsg(blockchain) {
  return {
    type: MessageType.RESPONSE_BLOCKCHAIN, 
    data: JSON.stringify(blockchain)
  }
}

function responseLatestMsg(blockchain) {
  return {
    type: MessageType.RESPONSE_BLOCKCHAIN,
    data: JSON.stringify([getLatestBlock(blockchain)])
  }
}

function write(ws, message) {
  return ws.send(JSON.stringify(message));
}

function broadcast(data) {
  if(peers.length) {
    program.log('Data to be broadcasted: ', data);
    peers.forEach(peer => peer.write(data))
  } else {
    program.log('No connected peers, Don\'t broadcast.');
  }
}

function handleBlockchainResponse(message, blockchain) {
  const receivedBlocks = JSON.parse(message.data).sort((b1, b2) => (b1.index - b2.index));
  const latestBlockReceived = receivedBlocks[receivedBlocks.length - 1];
  const latestBlockHeld = getLatestBlock(blockchain);
  program.log(receivedBlocks.length);
  if (latestBlockReceived.index > latestBlockHeld.index) {

    program.log(
      'Blockchain possibly behind. My last block index: ' + 
      latestBlockHeld.index + 
      ' Peer last block index: ' + 
      latestBlockReceived.index
    );

    if (latestBlockHeld.hash === latestBlockReceived.previousHash) {
      program.log("We can append the received block to our chain");
      blockchain.push(latestBlockReceived);
      broadcast(JSON.stringify(responseLatestMsg(blockchain)));
    } else if (receivedBlocks.length === 1) {
      program.log("We have to query the chain from our peer");
      broadcast(JSON.stringify(queryAllMsg()));
    } else {
      program.log("Received blockchain is longer than current blockchain");
      program.log('received blocks ====>', receivedBlocks);
      program.log(receivedBlocks.constructor === Array);
      program.log('is response latest msg defined in p2p.js ===>', responseLatestMsg);
      replaceChain(receivedBlocks, blockchain, responseLatestMsg, broadcast);
    }
  } else {
    program.log('received blockchain is not longer than received blockchain. Do nothing');
  }
}

function addPeer(peer) {
  peers.push(peer);
}

module.exports = {
  p2p: p2p,
  broadcast: broadcast,
  responseLatestMsg: responseLatestMsg,
  queryChainLengthMsg: queryChainLengthMsg, 
  onData: onData,
  addPeer: addPeer,
};