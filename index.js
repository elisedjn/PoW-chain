const jayson = require('jayson');
const { startMining, stopMining } = require('./mine');
const { PORT } = require('./config');
const { utxos } = require('./db');

const server = jayson.server({
  startMining: function (_, callback) {
    callback(null, 'succes!');
    startMining();
  },
  stopMining: function (_, callback) {
    callback(null, 'succes!');
    stopMining();
  },
  getBalance: function ([address], callback) {
    const relevantUTXOs = utxos.filter((x) => x.owner === address && !x.spent);
    const sum = relevantUTXOs.reduce((acc, x) => (acc += x.amount), 0);
    callback(null, sum);
  },
});

server.http().listen(PORT);
