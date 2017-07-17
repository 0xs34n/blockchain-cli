const Block = require('./block')
const CryptoJS = require('crypto-js')
const logger = require('../cli/util/logger.js');
const spinner = require('../cli/util/spinner.js');

class Blockchain {
  constructor () {
    this.blockchain = [Block.genesis]
    this.difficulty = 4
  }

  get () {
    return this.blockchain
  }

  get latestBlock () {
    return this.blockchain[this.blockchain.length - 1]
  }

  mine (seed) {
    const newBlock = this.generateNextBlock(seed)
    this.addBlock(newBlock)
  }

  replaceChain (newBlocks) {
    if (!this.isValidChain(newBlocks)) {
      logger.warn("Won't replace existing blockchain. Replacement chain is not valid.")
      return null;
    }

    if (newBlocks.length <= this.blockchain.length) {
      logger.info("Won't replace existing blockchain. Replacement chain is shorter than original")
      return null;
    }

    logger.confirm('Received blockchain is valid. Replacing current blockchain with received blockchain')
    this.blockchain = newBlocks.map(json => new Block(
      json.index, json.previousHash, json.timestamp, json.data, json.hash, json.nonce
    ))
  }

  isValidChain (blockchainToValidate) {
    if (JSON.stringify(blockchainToValidate[0]) !== JSON.stringify(Block.genesis)) {
      return false
    }

    const tempBlocks = [blockchainToValidate[0]]
    for (let i = 1; i < blockchainToValidate.length; i = i + 1) {
      if (this.isValidNewBlock(blockchainToValidate[i], tempBlocks[i - 1])) {
        tempBlocks.push(blockchainToValidate[i])
      } else {
        return false
      }
    }
    return true
  }

  addBlock (newBlock) {
    if (this.isValidNewBlock(newBlock, this.latestBlock)) {
      this.blockchain.push(newBlock)
    }
  }

  addBlockFromPeer(json) {
    if (this.isValidNewBlock(json, this.latestBlock)) {
      this.blockchain.push(new Block(
        json.index, json.previousHash, json.timestamp, json.blockData, json.hash, json.nonce
      ))
    }
  }

  calculateHashForBlock (block) {
    return this.calculateHash(block.index, block.previousHash, block.timestamp, block.data, block.nonce)
  }

  calculateHash (index, previousHash, timestamp, data, nonce) {
    return CryptoJS.SHA256(index + previousHash + timestamp + data + nonce).toString()
  }

  isValidNewBlock (newBlock, previousBlock) {
    const blockHash = this.calculateHashForBlock(newBlock);

    if (previousBlock.index + 1 !== newBlock.index) {
      logger.warn('new block has invalid index')
      return false
    } else if (previousBlock.hash !== newBlock.previousHash) {
      logger.warn('new block has invalid previous hash')
      return false
    } else if (blockHash !== newBlock.hash) {
      logger.warn(`invalid hash: ${blockHash} ${newBlock.hash}`)
      return false
    } else if (!this.isValidHashDifficulty(this.calculateHashForBlock(newBlock))) {
      logger.warn(`invalid hash does not meet difficulty requirements: ${this.calculateHashForBlock(newBlock)}`);
      return false;
    }
    return true
  }

  generateNextBlock (blockData) {
    const previousBlock = this.latestBlock;
    const nextIndex = previousBlock.index + 1;
    const nextTimestamp = new Date().getTime() / 1000
    let nonce = 0;
    let nextHash = '';
    const randSpinner = spinner.getRandomSpinner();
    while(!this.isValidHashDifficulty(nextHash)) {     
      nonce = nonce + 1;
      nextHash = this.calculateHash(nextIndex, previousBlock.hash, nextTimestamp, blockData, nonce);
      spinner.draw(randSpinner);
    }
    spinner.clear()
    logger.confirm(`${new Date().toUTCString()} mined block! nonce/hash = ${nonce}/${nextHash}`)
    return new Block(nextIndex, previousBlock.hash, nextTimestamp, blockData, nextHash, nonce)
  }

  isValidHashDifficulty(hash) {
    return (hash.indexOf(Array(this.difficulty + 1).join('0')) === 0);
  }
}

module.exports = new Blockchain()