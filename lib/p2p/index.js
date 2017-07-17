const messages = require('./messages')
const {
  QUERY_LATEST,
  QUERY_ALL,
  RESPONSE_BLOCKCHAIN
} = require('./messages/message-type');
const wrtc = require('wrtc');
const Exchange = require('peer-exchange');
const p2p = new Exchange('blockchain.js', { wrtc: wrtc });
const net = require('net');
const blockchain = require('../blockchain')
const logger = require('../cli/util/logger.js');

class PeerToPeer {
  constructor() {
    this.peers = [];
  }

  startServer (port) {
    const server = net.createServer(socket => p2p.accept(socket, (err, connection) => {
      if (err) logger.error(err);
      this.initConnection.call(this, connection)
    })).listen(port);
    logger.confirm(`starting server on ${server.address().address}:${server.address().port}...`);
  }

  connectToPeer(ip) {
    const ipArr = ip.split(":")
    const hostname = ipArr[0];
    const port = ipArr[1];
    const socket = net.connect(port, hostname, () => p2p.connect(socket, (err, connection) => {
      if (err) logger.error(err);
      this.initConnection.call(this, connection)
    }));
  }

  discoverPeers() {
    p2p.getNewPeer((err) => {
      if (err) {
        logger.err(err);
      } else {
        logger.confirm('discovered new peers') //todo
      }
    })
  }

  initConnection(connection) {
    this.peers.push(connection);
    this.initMessageHandler(connection);
    this.initErrorHandler(connection);
    this.write(connection, messages.getQueryChainLengthMsg())
  }

  initMessageHandler(connection) {
    connection.on('data', data => {
      const message = JSON.parse(data.toString('utf8'));
      logger.info(`Received message ${JSON.stringify(message)}`)
      this.handleMessage(connection, message);
    })
  }

  handleMessage(peer, message) {
    switch (message.type) {
      case QUERY_LATEST:
        this.write(peer, messages.getResponseLatestMsg(blockchain))
        break
      case QUERY_ALL:
        this.write(peer, messages.getResponseChainMsg(blockchain))
        break
      case RESPONSE_BLOCKCHAIN:
        this.handleBlockchainResponse(message)
        break
      default:
        logger.warn(`Received unknown message type ${message.type}`)
    }
  }

  initErrorHandler(connection) {
    connection.on('error', error => logger.error(error));
  }

  broadcastLatest () {
    this.broadcast(messages.getResponseLatestMsg(blockchain))
  }

  broadcast(message) {
    this.peers.forEach(peer => this.write(peer, message))
  }

  write(peer, message) {
    peer.write(JSON.stringify(message));
  }

  closeConnection() {

  }

  handleBlockchainResponse(message) {
    const receivedBlocks = JSON.parse(message.data).sort((b1, b2) => (b1.index - b2.index));
    const latestBlockReceived = receivedBlocks[receivedBlocks.length - 1];
    const latestBlockHeld = blockchain.latestBlock

    if (latestBlockReceived.index <= latestBlockHeld.index) {
      logger.confirm('received blockchain is not longer than received blockchain. Do nothing')
      return null;
    }

    logger.info(`blockchain possibly behind. We got: ${latestBlockHeld.index}, Peer got: ${latestBlockReceived.index}`)
    if (latestBlockHeld.hash === latestBlockReceived.previousHash) {
      logger.confirm('Same hash found on latest block, append the received block to our chain')
      blockchain.addBlockFromPeer(latestBlockReceived)
      this.broadcast(messages.getResponseLatestMsg(blockchain))
    } else if (receivedBlocks.length === 1) {
      logger.info('Latest block is different, query the entire chain from our peer')
      this.broadcast(messages.getQueryAllMsg())
    } else {
      logger.info('Received blockchain is longer than current blockchain, latest block hash different.')
      blockchain.replaceChain(receivedBlocks)
      this.broadcast(messages.getResponseLatestMsg(blockchain))
    }
  }
}


module.exports = new PeerToPeer();