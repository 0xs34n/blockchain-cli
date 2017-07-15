const blockchain = require('../../blockchain');

module.exports = function (vorpal) {
  vorpal
    .command('blockchain', 'blockchain output')
    .alias('bc')
    .action(function(args, callback) {
      this.log(blockchain);
      callback();
    })
}