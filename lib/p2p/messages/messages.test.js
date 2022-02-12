import test from 'ava'
import messages from '.'
import { stub } from 'sinon'
import blockchain from '../../blockchain'
import Block, { genesis } from '../../blockchain/block'
import {
  QUERY_LATEST,
  QUERY_ALL,
  RESPONSE_BLOCKCHAIN
} from './message-type'

test('#getQueryChainLengthMessage', t => {
  const message = messages.getQueryChainLengthMsg()
  t.is(message.type, QUERY_LATEST)
})

test('#getQueryAllMsg', t => {
  const message = messages.getQueryAllMsg()
  t.is(message.type, QUERY_ALL)
})

test('#getResponseChainMsg :: type', t => {
  blockchain.persistence.createGenesis([genesis])
  blockchain.persistence.clearBlocks()
  blockchain.persistence.insertBlocks(new Block(200))
  const message = messages.getResponseChainMsg(blockchain)
  t.is(message.type, RESPONSE_BLOCKCHAIN)
})

test('#getResponseChainMsg :: data', t => {
  blockchain.persistence.clearBlocks();
  const chain = ['x', 'y']
  stub(blockchain, 'get').returns(chain)
  const message = messages.getResponseChainMsg(blockchain)
  t.is(message.data, JSON.stringify(chain))
})

test('#getResponseLatestMsg :: type', t => {
  const message = messages.getResponseLatestMsg(blockchain)
  t.is(message.type, RESPONSE_BLOCKCHAIN)
})

test('#getResponseLatestMsg :: data', t => {
  blockchain.persistence.clearBlocks();
  const lastBlock = new Block(900)
  //blockchain.persistence.createGenesis([])
  //blockchain.persistence.clearBlocks()
  blockchain.persistence.insertBlocks(lastBlock)
  const message = messages.getResponseLatestMsg(blockchain)
  t.is(message.data, JSON.stringify([lastBlock]))
  blockchain.persistence.clearBlocks();
})