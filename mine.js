const db = require('./db');
const Transaction = require('./models/Transaction');
const UTXO = require('./models/UTXO');
const Block = require('./models/Block');
const { PUBLIC_KEY } = require('./config');

const TARGET_DIFFICULTY = BigInt('0x00' + 'f'.repeat(62));
const BLOCK_REWARD = 10;
let mining = false;

const startMining = () => {
  mining = true;
  mine();
};

const stopMining = () => {
  mining = false;
};

const mine = () => {
  if (!mining) return;

  const block = new Block();

  //TODO : Add transactions from the mempool

  const coinbaseUTXO = new UTXO(PUBLIC_KEY, BLOCK_REWARD);
  const coinbaseTX = new Transaction([], [coinbaseUTXO]);
  block.addTransaction(coinbaseTX);

  console.log(block.transactions[0]);

  while (BigInt('0x' + block.hash()) >= TARGET_DIFFICULTY) {
    block.nonce++;
  }
  block.execute();
  db.blockchain.addBlock(block);

  console.log(
    `Just mined block #${db.blockchain.blockHeight()} with a nonce of ${block.nonce}`
  );

  setTimeout(mine, 2500);
};

module.exports = { startMining, stopMining };
