const { SHA256 } = require('crypto-js');
const logger = require('../../cli/util/logger.js');
const spinner = require('../../cli/util/spinner.js');

module.exports = class Block {
  static get genesis () {
    return new Block(
      0,
      '0',
      1501122600,
      'Welcome to Blockchain CLI!',
      '0000018035a828da0878ae92ab6fbb16be1ca87a02a3feaa9e3c2b6871931046',
      56551
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