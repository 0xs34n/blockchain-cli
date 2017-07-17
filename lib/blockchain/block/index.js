const { SHA256 } = require('crypto-js');
const logger = require('../../cli/util/logger.js');
const spinner = require('../../cli/util/spinner.js');

module.exports = class Block {
  static get genesis () {
    return new Block(
      0,
      '0',
      1465154705,
      'Welcome to blockchain.js',
      '816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7',
      0
    )
  }

  constructor (
    index = 0,
    previousHash = '0',
    timestamp = new Date().getTime() / 1000,
    data = 'none',
    hash = '',
    nonce = 0
  ) {
    this.index = index
    this.previousHash = previousHash.toString()
    this.timestamp = timestamp
    this.data = data
    this.hash = hash.toString()
    this.nonce = nonce
  }
}