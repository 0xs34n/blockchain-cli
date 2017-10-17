import test from 'ava'
import blockchain from '.'
import { stub } from 'sinon'
import Block, { genesis } from './block'

test('invalid chain :: not genesis block', t => {
  const valid = blockchain.isValidChain([new Block()])
  t.false(valid)
})

test('valid chain', t => {
  const valid = blockchain.isValidChain([genesis])
  t.true(valid)
})

test('invalid chain :: invalid next block', t => {
  const valid = blockchain.isValidChain([genesis, new Block()])
  t.false(valid)
})

test('add block :: valid chain', t => {
  blockchain.persistence.clearBlocks();
  const bb = blockchain.get();
  console.log("\n\n\n\nzzzzz\n", bb)
  //const firstBlock = new Block()
  stub(blockchain, 'isValidNewBlock').returns(true)
  //blockchain.blockchain = [firstBlock]
  blockchain.addBlock(new Block())
  blockchain.addBlock(new Block())
  const blocks = blockchain.get();
  console.log("\n\n\n\nXXXX\n", blocks)
  t.is(blocks.length, 2)
  blockchain.isValidNewBlock.restore();
})

test('add block :: invalid chain', t => {
  blockchain.persistence.clearBlocks();
  const firstBlock = new Block()
  stub(blockchain, 'isValidNewBlock').returns(false)
  //blockchain.blockchain = [firstBlock]
  //blockchain.addBlock('xyz')
  blockchain.persistence.insertBlocks(firstBlock)
  blockchain.addBlock(new Block())
  const blocks = blockchain.get();
  t.is(blocks.length, 1)
  blockchain.isValidNewBlock.restore()
})

test('replace chain :: invalid chain', t => {
  const originalChain = [genesis]
  blockchain.blockchain = originalChain
  blockchain.replaceChain(originalChain.concat([new Block()]))
  t.is(blockchain.blockchain, originalChain)
})

//test('replace chain :: chain too short', t => {
//  const secondBlock = genesis.generateChild('x')
//  const originalChain = [genesis, secondBlock]
//  blockchain.blockchain = originalChain
//  blockchain.replaceChain([genesis])
//  t.is(blockchain.blockchain, originalChain)
//})

//test('replace chain', t => {
//  const secondBlock = genesis.generateChild('x')
//  const thirdBlock = secondBlock.generateChild('x')
//  const fourthBlock = thirdBlock.generateChild('x')
//  const originalChain = [genesis, secondBlock]
//  const replacementChain = [genesis, secondBlock, thirdBlock, fourthBlock]
//  blockchain.blockchain = originalChain
//  blockchain.replaceChain(replacementChain)
//  t.is(blockchain.blockchain, replacementChain)
//})

test('latest block', t => {
  blockchain.persistence.clearBlocks()
  const firstBlock = new Block(33)
  blockchain.persistence.insertBlocks(firstBlock)
  //blockchain.addBlock(firstBlock)
  const secondBlock = new Block(25);
  stub(blockchain, 'isValidNewBlock').returns(true)
  blockchain.addBlock(secondBlock)
  t.is(JSON.stringify(blockchain.latestBlock), JSON.stringify(secondBlock))
  blockchain.isValidNewBlock.restore()
})

test('mine', t => {
  blockchain.persistence.clearBlocks()
  const mined = new Block(500)
  stub(blockchain, 'generateNextBlock').returns(mined)
  stub(blockchain, 'isValidNewBlock').returns(true)
  blockchain.addBlock(new Block(300))
  blockchain.addBlock(new Block(200))
  //blockchain.blockchain = ['x', secondBlock]
  blockchain.mine('a')
  
  console.log("\n\n\n\n\SYDNEY", blockchain.get())
  console.log("\n\n\n\n\SYDNEY", blockchain.get()[2])
  //console.log("\n\n\n\n\SYDNEY", secondBlock)

  t.is(blockchain.get().length, 3)
  t.is(JSON.stringify(blockchain.get()[2]), JSON.stringify(mined))
  blockchain.generateNextBlock.restore()
  blockchain.isValidNewBlock.restore()
})

test('mine :: invalid reward block', t => {
  const secondBlock = new Block()
  stub(blockchain, 'generateNextBlock').returns('z')
  stub(blockchain, 'isValidNewBlock').returns(false)
  blockchain.blockchain = ['x', secondBlock]
  blockchain.mine('a')
  t.is(blockchain.blockchain.length, 2)
  blockchain.generateNextBlock.restore()
  blockchain.isValidNewBlock.restore()
})