
<h1 align="center">
  <br>
  <a href=""><img src="https://raw.githubusercontent.com/seanseany/blockchain.js/master/img/logo.png?token=AHErP6Pc7Nmh9hCXaxM6TzOquFW1-8v3ks5Zdk5GwA%3D%3D" width="300"></a>
</h1>


<h4 align="center">A blockchain command-line interface built with JavaScript.</h4>

<p align="center">
  <a href="https://badge.fury.io/js/blockchain.js">
    <img src="https://badge.fury.io/js/blockchain.js.svg"
         alt="Gitter">
  </a>
</p>
<br>

![screenshot](https://raw.githubusercontent.com/seanseany/blockchain.js/master/img/demo.gif?token=AHErPzDYYgcElDoIS7l5eECL7Pf6iZMNks5Zdq9SwA%3D%3D)

## Features
- 💎 Blocks with index, hash, data, and timestamp.
- ⛏ Proof-of-work system.
- ⛓ In-memory JavaScript array to store the blockchain.
- ✅ Block integrity validation.
- 📡 Peer-to-peer communication.

## Installation

To install this application, you'll need [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

### From NPM

```bash
$ npm install blockchain.js -g
$ blockchain
```

### From Source

You'll need [Git](https://git-scm.com) to run the project from source. From your command line:

```bash
# Clone this repository
$ git clone https://github.com/seanseany/blockchain.js

# Go into the repository
$ cd blockchain.js

# Install dependencies
$ npm install

# Run the app
$ npm start
```

## Built With

* [Varpol](https://github.com/dthree/vorpal) - Interactive node CLI
* [Peer Exchange](https://github.com/mappum/peer-exchange/) - Peer to peer communication
* [Crypto-js](https://github.com/brix/crypto-js) - Crypto library for hashing blocks

## License

This project is licensed under the Apache-2.0 License - see the [LICENSE.txt](LICENSE.txt) file for details

## Acknowledgments

* Project inspired by [this article](https://medium.com/@lhartikk/a-blockchain-in-200-lines-of-code-963cc1cc0e54) written by Lauri Hartikka.
* Antony Jones [repository](https://github.com/antony/naivechain) for refactoring.
* Nick Fallon for PoW implementation in this [repository](https://github.com/nickfallon/naivechain)/
* Logo designed by Muammark / Freepik.