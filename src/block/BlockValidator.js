const Block = require('./Block');
const Genesis = require('./GenesisBlock');
const CryptoJS = require('crypto-js');

function isValidNewBlock(newBlock, previousBlock) {
  console.log(previousBlock);
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

function calculateHashForBlock(block) {
  return CryptoJS.SHA256(block.index + block.previousHash + block.timestamp + block.data).toString()
}


module.exports = {
  isValidNewBlock: isValidNewBlock
};
