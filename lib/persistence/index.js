const fs = require('fs');
const crypto = require('crypto');

module.exports = class Persistence {
    constructor(blockchainfile) {
        this.blockchainfile = blockchainfile;
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
            fs.writeFileSync(this.blockchainfile, JSON.stringify([]), 'utf8');
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
            fs.writeFileSync(this.blockchainfile, JSON.stringify([genesis]));
            return true;
        }
    }
}