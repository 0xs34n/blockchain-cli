const CryptoJS = require("crypto-js");
const GenesisBlock = require('../block/GenesisBlock.js');
let Blockchain = './Blockchain.js';
const Block = require('../block/Block.js');
const isValidNewBlock = require('../block/BlockValidator.js').isValidNewBlock;


function addBlock(newBlock, blockchain) {
  if (isValidNewBlock(newBlock, getLatestBlock(blockchain))) {
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

function replaceChain(newBlocks, blockchain, responseLatestMsg, broadcast) {
  console.log('length is longer ===>', newBlocks.length > blockchain.length);
  console.log('isvalidchain ====>', isValidChain(newBlocks));
  if (isValidChain(newBlocks) && newBlocks.length > blockchain.length) {
    console.log('Received blockchain is valid. Replacing current blockchain with received blockchain');
    newBlocks.forEach((newBlock, index) => {
      blockchain[index] = newBlock
    })
    broadcast(JSON.stringify(responseLatestMsg(blockchain)));
  } else {
    console.log('Received blockchain invalid!')
  }
}

function isValidChain(blockchainToValidate) {
  if (JSON.stringify(blockchainToValidate[0]) !== JSON.stringify(GenesisBlock)) {
    return false;
  }
  const tempBlocks = [blockchainToValidate[0]];
  for (let i = 1; i < blockchainToValidate.length; i++) {
    console.log(tempBlocks[i - 1]);
    console.log(tempBlocks);
    console.log(blockchainToValidate[i]);
    if(isValidNewBlock(blockchainToValidate[i], tempBlocks[i - 1])) {
      tempBlocks.push(blockchainToValidate[i]);
    } else {
      return false;
    }
  }
  return true;
}

function calculateHash(index, previousHash, timestamp, data) {
  return CryptoJS.SHA256(index + previousHash + timestamp + data).toString();
}

module.exports = {
  addBlock: addBlock,
  generateNextBlock: generateNextBlock,
  getLatestBlock: getLatestBlock,
  replaceChain: replaceChain
};