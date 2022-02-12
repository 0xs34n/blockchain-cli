import test from 'ava'
import Persistence from '.'
import fs from 'fs'
import { stub } from 'sinon'
import Block, { genesis } from '../blockchain/block'
const chainLocation = '/tmp/blockchain.json'
const persistence = new Persistence(chainLocation)

test('createGenesis :: blockchain file created', t => {
    fs.existsSync(chainLocation) ? fs.unlinkSync(chainLocation) : {}
    persistence.createGenesis([genesis])
    t.true(fs.existsSync(chainLocation))
})

test('insertBlocks :: new chain appended', t => {
    fs.existsSync(chainLocation) ? fs.unlinkSync(chainLocation) : {}
    persistence.createGenesis([genesis])
    persistence.clearBlocks()
    t.true(fs.existsSync(chainLocation))
    persistence.insertBlocks(new Block(999))
    persistence.insertBlocks(new Block(888))
    let blockchain = persistence.readBlocks()
    t.true(blockchain.length == 2)
})

test('clearBlocks :: empty chain', t => {
    fs.existsSync(chainLocation) ? fs.unlinkSync(chainLocation) : {}
    persistence.createGenesis([genesis])
    persistence.clearBlocks()
    t.true(fs.existsSync(chainLocation))
    persistence.insertBlocks(new Block())
    let data = persistence.readBlocks()
    t.true(data.length == 1)
    persistence.clearBlocks()
    data = persistence.readBlocks()
    t.true(data.length == 0)
})