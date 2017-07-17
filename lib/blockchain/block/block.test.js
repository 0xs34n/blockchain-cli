import test from 'ava'
import Block from '.'

test('not genesis block', t => {
  const genesis = Block.genesis
  t.true(genesis.isGenesisBlock())
})

test('not genesis block', t => {
  const block = new Block()
  t.false(block.isGenesisBlock())
})

test('next block has correct data', t => {
  const seed = 'xyz'
  const block = new Block()
  const next = block.generateChild(seed)
  t.is(next.data, seed)
})

test('next block has previous block hash', t => {
  const block = new Block()
  const next = block.generateChild('xyz')
  t.is(next.previousHash, block.hash)
})

test('next block has correct index', t => {
  const block = new Block()
  const next = block.generateChild('xyz')
  t.is(next.index, block.index + 1)
})

test('next block has non zero nonce', t => {
  const block = new Block()
  const next = block.generateChild('xyz')
  t.not(next.nonce, 0)
})

test('hash stored', t => {
  const hash = '63e1bfa22a349803216946f9a6e58faad3da1a2e871e3af86476df6e2976b779'
  const block = new Block(47, 'd34db33f', 9876543210, 'some string', hash)
  t.is(block.hash, hash)
})

test('correct hash generated', t => {
  const hash = '63e1bfa22a349803216946f9a6e58faad3da1a2e871e3af86476df6e2976b779'
  const block = new Block(47, 'd34db33f', 9876543210, 'some string')
  t.is(block.calculateHash(), hash)
})

test('invalid child :: lower index', t => {
  const parent = new Block(48)
  const childHash = '69e69e1bed9bb8788505b26b05ad8386a91eebeb84a1edaff1ded24c09b97030'
  const child = new Block(47, parent.hash, null, null, childHash)
  t.false(parent.isValidChild(child))
})

test('invalid child :: same index', t => {
  const parent = new Block(47)
  const childHash = '69e69e1bed9bb8788505b26b05ad8386a91eebeb84a1edaff1ded24c09b97030'
  const child = new Block(47, parent.hash, null, null, childHash)
  t.false(parent.isValidChild(child))
})

test('valid child :: correct index', t => {
  const parent = new Block(46)
  const childHash = '69e69e1bed9bb8788505b26b05ad8386a91eebeb84a1edaff1ded24c09b97030'
  const child = new Block(47, parent.hash, null, null, childHash)
  t.true(parent.isValidChild(child))
})

test('invalid child :: incorrect previous hash', t => {
  const parent = new Block(46)
  const childHash = '1cbab710e77d15d1e0f0b0162f941591958627c2a0321563938793b78a969fa9'
  const child = new Block(47, '1', null, null, childHash)
  t.false(parent.isValidChild(child))
})

test('valid child :: matching blockhash', t => {
  const parent = new Block(46)
  const childHash = '69e69e1bed9bb8788505b26b05ad8386a91eebeb84a1edaff1ded24c09b97030'
  const child = new Block(47, parent.hash, null, null, childHash)
  t.true(parent.isValidChild(child))
})