const fs = require('fs');
const crypto = require('crypto');

class Persistence {
    constructor() {
        this.blockchainfile = '/home/nodejs/app/blockchain.json';
    }

    insertBlocks(input) {
        let data = JSON.parse(fs.readFileSync(this.blockchainfile, 'utf8'));
        data.push(input);
        try {
            fs.writeFileSync(this.blockchainfile, JSON.stringify(data), 'utf8');
            return true;
        } catch (err) {
            console.log("ERROR insert", err);
        }
        return false;
    }

    clearBlocks() {
        try {
            fs.writeFileSync(this.blockchainfile, '', 'utf8');
            return true;
        } catch (err) {
            console.log("ERROR insert", err);;
        }
        return false;
    }

    readBlocks() {
        return JSON.parse(fs.readFileSync(this.blockchainfile, 'utf8'));
    }

    createGenesis(genesis) {
        if (fs.existsSync(this.blockchainfile)) {
            return false;
        } else {
            fs.writeFile(this.blockchainfile, JSON.stringify(genesis), err => {
                if (err) throw err;
                return true;
            });
        }
    }
}

const persistence = new Persistence()
module.exports = persistence;