const fs = require('fs');
const crypto = require('crypto');

module.exports = class Persistence {
    constructor(blockchainfile) {
        this.blockchainfile = blockchainfile;
    }

    insertBlocks(input) {
        let data = this.readBlocks(); //JSON.parse(fs.readFileSync(this.blockchainfile, 'utf8'));
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
            const data = []
            fs.writeFileSync(this.blockchainfile, JSON.stringify(data), 'utf8');
            return true;
        } catch (err) {
            console.log("ERROR insert", err);;
        }
        return false;
    }

    readBlocks() {
        try{
            return JSON.parse(fs.readFileSync(this.blockchainfile, 'utf8'));

        } catch(err) {
            return [];
        }
        
    }

    createGenesis(genesis) {
        if (fs.existsSync(this.blockchainfile)) {
            return false;
        } else {
            fs.writeFileSync(this.blockchainfile, JSON.stringify(genesis));
            return true;
        }
    }
}