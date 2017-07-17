import test from 'ava'
import p2p from '.'
import { stub } from 'sinon'
import messages from './messages'
import { QUERY_LATEST, QUERY_ALL, RESPONSE_BLOCKCHAIN } from './messages/message-type'
import { genesis } from '../blockchain/block'
import { blockchain } from '../blockchain'

test.beforeEach(() => {
  p2p.peers = []
})

test.skip('takes peers from environment', t => {
  // const peers = [
  //   'ws://127.0.0.1:3003',
  //   'ws://127.0.1.1:3304',
  //   'ws://127.0.1.2:3005'
  // ]
  // process.env.PEERS = peers.join(',')
  // p2p.bootstrap()
  // t.deepEqual(p2p.peers, peers)
  // process.env.PEERS = ''
})

test('#initConnection :: add event hooks', t => {
  const connection = { on: stub(), write: stub() }
  const err = { on: stub() }
  p2p.initConnection(connection)
  t.deepEqual(p2p.peers, [connection])
  t.is(connection.on.callCount, 2)
  t.is(connection.on.firstCall.args[0], 'data')
  t.is(connection.on.secondCall.args[0], 'error')
})

test('#initConnection :: write event', t => {
  const connection = { on: stub(), write: stub() }
  const payload = JSON.stringify(messages.getQueryChainLengthMsg())
  p2p.initConnection(connection)
  t.is(connection.write.callCount, 1)
  t.is(connection.write.firstCall.args[0], payload)
})

test('#initMessageHandler()', t => {
  const connection = { on: stub() }
  p2p.initMessageHandler(connection)
  t.is(connection.on.callCount, 1)
})

test.serial('#handleMessage :: QUERY_LATEST', t => {
  const message = { x: 'y' }
  stub(p2p, 'write')
  stub(messages, 'getResponseLatestMsg').returns(message)
  p2p.handleMessage(null, { type: QUERY_LATEST })
  t.is(p2p.write.callCount, 1)
  t.is(p2p.write.firstCall.args[1], message)
  p2p.write.restore()
})

test.serial('#handleMessage :: QUERY_ALL', t => {
  const message = { x: 'y' }
  stub(p2p, 'write')
  stub(messages, 'getResponseChainMsg').returns(message)
  p2p.handleMessage(null, { type: QUERY_ALL })
  t.is(p2p.write.callCount, 1)
  t.is(p2p.write.firstCall.args[1], message)
  p2p.write.restore()
  messages.getResponseChainMsg.restore()
})

test.serial('#handleMessage :: RESPONSE_BLOCKCHAIN', t => {
  stub(p2p, 'handleBlockchainResponse')
  p2p.handleMessage(null, { type: RESPONSE_BLOCKCHAIN, data: [] })
  t.is(p2p.handleBlockchainResponse.callCount, 1)
  p2p.handleBlockchainResponse.restore()
})

test.skip('#closeConnection', t => {
  // const a = { url: 'a' }
  // const c = { url: 'c' }
  // const disconnected = { url: 'b' }
  // p2p.sockets = [a, disconnected, c]
  // p2p.closeConnection(disconnected)
  // t.is(p2p.sockets.length, 2)
  // t.deepEqual(p2p.sockets, [a, c])
})

test('#handleBlockchainResponse :: shorter blockchain', t => {
  const newChain = JSON.stringify([{ index: 7 }, { index: 8 }])
  blockchain.latestBlock = { index: 9 }
  const result = p2p.handleBlockchainResponse({ data: newChain })
  t.is(result, undefined)
})

test('#handleBlockchainResponse :: dont add invalid block', t => {
  const newChain = JSON.stringify([{ index: 9 }, { index: 10, previousHash: '123' }])
  const nextBlock = blockchain.latestBlock = { index: 9, hash: '123' }
  p2p.handleBlockchainResponse({ data: newChain })
  t.is(blockchain.latestBlock, nextBlock)
})
