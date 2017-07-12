const CryptoJS = require("crypto-js");
const GenesisBlock = require('../block/GenesisBlock.js');
const Validator = require('../block/BlockValidator.js');
const Block = require('../block/Block.js');
const BlockValidator = require('../block/BlockValidator.js');


function addBlock(newBlock, blockchain) {
  if (BlockValidator.isValidNewBlock(newBlock, getLatestBlock(blockchain))) {
    blockchain.push(newBlock);
  }
}

function getLatestBlock(blockchain) {
  return blockchain[blockchain.length - 1];
}

function generateNextBlock(blockData, blockchain) {
  const previousBlock = getLatestBlock(blockchain);
  const nextIndex = previousBlock.index + 1;
  const nextTimestamp = new Date().getTime() / 1000;
  const nextHash = calculateHash(nextIndex, previousBlock.hash, nextTimestamp, blockData);
  return new Block(nextIndex, previousBlock.hash, nextTimestamp, blockData, nextHash);
}

function replaceChain(newBlocks) {
  if (isValidChain(newBlocks) && newBlocks.length > blockchain.length) {
    console.log('Received blockchain is valid. Replacing current blockchain with received blockchain');
    broadcast(responseLatestMsg());
    return newBlocks;
  } else {
    console.log('Received blockchain invalid!')
  }
}

function calculateHash(index, previousHash, timestamp, data) {
  return CryptoJS.SHA256(index + previousHash + timestamp + data).toString();
}

module.exports = {
  addBlock: addBlock,
  generateNextBlock: generateNextBlock,
  getLatestBlock: getLatestBlock
};