const Exchange = require('peer-exchange');
const wrtc = require('wrtc');
const p2p = new Exchange('uNode', { wrtc: wrtc });
const getLatestBlock = require('./chain/ChainManager.js').getLatestBlock;

const MessageType = {
  QUERY_LATEST: 0,
  QUERY_ALL: 1,
  RESPONSE_BLOCKCHAIN: 2
}

function onIncomingConnection(err, connection) {
  if (err) console.log(err);
  connection.on('data', data => {
    const message = data.toString('utf8');
    switch(message) {
      case MessageType.QUERY_LATEST:
        connection.send(responseLatestMsg(blockchain))
        // write(ws, responseLatestMsg());
        break;
      case MessageType.QUERY_ALL:
        connection.send(responseChainMsg(blockchain))
        // write(ws, responseChainMsg());
        break;
      case MessageType.RESPONSE_BLOCKCHAIN:
        handleBlockchainResponse(message);
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

function broadcast(message) {
  // return sockets.forEach(socket => write(socket, message));
  return p2p.peers.forEach(peer => peer.send(message));
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

module.exports = p2p;