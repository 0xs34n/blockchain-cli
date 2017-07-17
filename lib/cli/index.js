const vorpal = require('vorpal')();

module.exports = function (vorpal) {
  vorpal
    .use(require('./util/welcome.js'))
    .use(require('./command/list-blockchain.js'))
    .use(require('./command/mine-block.js'))
    .use(require('./command/list-peers.js'))
    .use(require('./command/discover-peers.js'))
    .use(require('./command/connect-peer.js'))
    .use(require('./command/open-port.js'))
    .delimiter('blockchain.js →')
    .show()
}
