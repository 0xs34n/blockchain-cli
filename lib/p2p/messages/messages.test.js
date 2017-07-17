import test from 'ava'
import messages from '.'
import { stub } from 'sinon'
import blockchain from '../../blockchain'
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
  const message = messages.getResponseChainMsg(blockchain)
  t.is(message.type, RESPONSE_BLOCKCHAIN)
})

test('#getResponseChainMsg :: data', t => {
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
  const lastBlock = 'y'
  blockchain.blockchain = ['x', lastBlock]
  const message = messages.getResponseLatestMsg(blockchain)
  t.is(message.data, JSON.stringify([lastBlock]))
})