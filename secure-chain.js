const SHA256 = require("crypto-js/sha256");

class Block {
  constructor(index, timestamp, data, previousHash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return SHA256(
      this.index +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.data)
    ).toString();
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block(0, "01/01/2026", "Genesis block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash != currentBlock.calculateHash()) {
        console.log("Block had its content updated");
        return false;
      }

      if (currentBlock.previousHash != previousBlock.hash) {
        console.log("Previous block hash doesn't match");
        return false;
      }
    }

    return true;
  }
}

let bitcoin = new Blockchain();
bitcoin.addBlock(
  new Block(1, "21/04/2026", { from: "Fulano", to: "Beotrano", amount: 10 })
);
bitcoin.addBlock(
  new Block(2, "22/04/2026", { from: "Ciclano", to: "Beotrano", amount: 22.4 })
);

console.log("Is blockchain valid? " + bitcoin.isChainValid());

bitcoin.chain[1].data = { amount: 10000 };
//bitcoin.chain[1].hash = bitcoin.chain[1].calculateHash();

console.log("Is blockchain valid? " + bitcoin.isChainValid());

//console.log(JSON.stringify(bitcoin, null, 4));
