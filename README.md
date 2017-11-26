
<h1 align="center">
  <br>
  <a href="https://github.com/seanseany/blockchain.js/"><img src="https://raw.githubusercontent.com/seanseany/blockchain-cli/master/img/logo.png" width="200"></a>
  <br>
    Blockchain CLI
  <br>
</h1>


<h4 align="center">A minimal blockchain command-line interface.</h4>

<p align="center">
  <a href="https://badge.fury.io/js/blockchain-cli">
    <img src="https://badge.fury.io/js/blockchain-cli.svg" alt="Gitter">
  </a>

  <!--<a href="https://www.npmjs.com/package/blockchain-cli">
      <img src="https://img.shields.io/npm/dt/blockchain-cli.svg" alt="Gitter">
  </a>-->
</p>
<br>

![screenshot](https://raw.githubusercontent.com/seanseany/blockchain-cli/master/img/demo.gif)

## 🎉 Features
- 💎 Blocks with index, hash, data, and timestamp.
- ⛏ Proof-of-work system.
- ⛓ In-memory JavaScript array to store the blockchain.
- ✅ Block integrity validation.
- 📡 Decentralized and distributed peer-to-peer communication.
- 🌴 Merkle tree implementation

## 📦 Installation

To install this application, you'll need [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

#### Source

You'll need [Git](https://git-scm.com) to run the project from source. From your command line:

```bash
# Clone this repository
$ git clone https://github.com/seanseany/blockchain-cli

# Go into the repository
$ cd blockchain-cli

# Install dependencies
$ npm install

# Run the app
$ npm start
```

## ⚒️ Built With

* [Vorpal](https://github.com/dthree/vorpal) - Interactive node CLI
* [Peer Exchange](https://github.com/mappum/peer-exchange/) - Peer to peer communication
* [Crypto-js](https://github.com/brix/crypto-js) - Crypto library for hashing blocks

## 🎫 License

This project is licensed under the Apache-2.0 License - see the [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

* [This article](https://medium.com/@lhartikk/a-blockchain-in-200-lines-of-code-963cc1cc0e54) written by Lauri Hartikka.
* Original [repo](https://github.com/lhartikk/naivechain) by Lauri Hartikka
* Antony Jone's [fork](https://github.com/antony/naivechain) for refactoring.
* Nick Fallon [fork](https://github.com/nickfallon/naivechain) for PoW implementation.
* Logo designed by Muammark / Freepik.
* FAQ by [/u/sheepiroth](https://www.reddit.com/r/javascript/comments/6ohc9h/a_blockchain_commandline_interface_built_with/dkiahix/)

## ℹ️ FAQ 

#### When or why I would use this?

You should use this if you want to build a bitcoin wallet, payment processor, or bitcoin merchant portal in javascript. You might also be interested in why decentralized networks or p2p applications are useful, or what advantages they have; this project seems like a good way to learn about that.

#### What is the block chain actually for?

The blockchain is for authorizing payments of a cryptocurrency between two peers without the need for a centralized 3rd party approving of the transaction. There are other uses of the blockchain which are more in line with the second point, digital signatures, but they are secondary to the main purpose of peer to peer transfer of value. Bitcoin is blockchain's killer app.

#### Why the hell should I care about the blockchain?

Blockchain facilitates trade over a network. Imagine a metal as scarce as gold with a magical property of "can be transported over a communications channel". This has implications with respect to individual rights, the world economy, and the way we monetize and transfer value at a level higher than bartering directly for goods.

Lately people are distancing themselves from the proof-of-work concept and are using blockchain to describe only the mechanism of signing a transaction as verification of sending an amount. Change "sending an amount" to almost anything else - authorizing a change in a ruleset, casting a vote for a politician, verifying a point of IoT data is authentic. Now add in the concept of a peer-to-peer network to this and you've eliminated a middleman that once existed, thereby improving the efficiency and reducing cost. In these cases, "blockchain" refers to the structuring of a program or database in such a way that it has no central point of failure while still providing all of the features expected. For example, augur and gnosis are decentralized prediction markets. Ethereum has implemented smart contracts which enable decentralized release of funds based on a gambling outcome.
