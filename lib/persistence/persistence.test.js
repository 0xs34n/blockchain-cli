import test from 'ava'
import Persistence from '.'
import fs from 'fs'
import { stub } from 'sinon'
import Block, { genesis } from '../blockchain/block'
const chainLocation = '/tmp/blockchain.json'
const  persistence = new Persistence(chainLocation)

test('createGenesis :: blockchain file created', t => {
    fs.existsSync(chainLocation) ? fs.unlinkSync(chainLocation) : {}
    persistence.createGenesis(genesis)
    t.true(fs.existsSync(chainLocation))
})

test('insertBlocks :: new chain appended', t => {
    fs.existsSync(chainLocation) ? fs.unlinkSync(chainLocation) : {}
    persistence.createGenesis(genesis)
    t.true(fs.existsSync(chainLocation))
    let block = new Block(1,0, new Date().getTime() / 1000, 'foo', 'bar-hash', 'random')
    persistence.insertBlocks(block)
    let blockchain = persistence.readBlocks()
    t.true(blockchain.length == 2)
})

test('clearBlocks :: empty chain', t => {
    fs.existsSync(chainLocation) ? fs.unlinkSync(chainLocation) : {}
    persistence.createGenesis(genesis)
    t.true(fs.existsSync(chainLocation))
    let block = new Block(1,0, new Date().getTime() / 1000, 'foo', 'bar-hash', 'random')
    persistence.insertBlocks(block)
    let blockchain = persistence.readBlocks()
    t.true(blockchain.length == 2)
    persistence.clearBlocks()
    blockchain = persistence.readBlocks()
    t.true(blockchain.length == 0)
})