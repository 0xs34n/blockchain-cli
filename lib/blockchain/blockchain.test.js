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
  const firstBlock = new Block()
  stub(blockchain, 'isValidNewBlock').returns(true)
  blockchain.blockchain = [firstBlock]
  const res = blockchain.addBlock('xyz')
  t.is(blockchain.blockchain.length, 2)
  blockchain.isValidNewBlock.restore();
})

test('add block :: invalid chain', t => {
  const firstBlock = new Block()
  stub(blockchain, 'isValidNewBlock').returns(false)
  blockchain.blockchain = [firstBlock]
  blockchain.addBlock('xyz')
  t.is(blockchain.blockchain.length, 1)
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
  const secondBlock = 'b'
  blockchain.blockchain = ['a', secondBlock]
  t.is(blockchain.latestBlock, secondBlock)
})

test('mine', t => {
  const secondBlock = new Block()
  const mined = 'z'
  stub(blockchain, 'generateNextBlock').returns(mined)
  stub(blockchain, 'isValidNewBlock').returns(true)
  blockchain.blockchain = ['x', secondBlock]
  blockchain.mine('a')
  t.is(blockchain.blockchain.length, 3)
  t.is(blockchain.blockchain[2], mined)
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