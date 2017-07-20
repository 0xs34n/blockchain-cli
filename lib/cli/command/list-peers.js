const p2p = require('../../p2p');

module.exports = function (vorpal) {
  vorpal
    .command('peers', 'connected peers')
    .alias('p')
    .action(function(args, callback) {
      // this.log(p2p.peers);
      // this.log(p2p.peers[0].pxpPeer)
      // this.log(p2p.peers[0].pxpPeer.socket)
      this.log(p2p.peers[0].pxpPeer.pxp)
      this.log(p2p.peers[0].pxpPeer.connected)
      this.log(p2p.peers[0].pxpPeer.remoteNetworks)
      this.log(p2p.peers[0].pxpPeer.remoteConnectInfo)
      callback();
    })
}