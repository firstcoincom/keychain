const secrets = require('secrets.js-grempe');

const Accounts = require('web3-eth-accounts');
const accounts = new Accounts();
var Tx = require('ethereumjs-tx');

const createWallet = (entropy, numShares, threshold) => {
  if (typeof entropy === 'undefined' || entropy === '') {
    throw new Error("entropy cannot be undefined or empty");
  }
  if (!numShares || !threshold) {
    throw new Error("numShares or threshold invalid");
  }

  if (numShares < 0 || threshold < 0) {
    throw new Error("numShares and threshold cannot be negative");
  }

  if (numShares < threshold) {
    throw new Error("numShares cannot be less than threshold");
  }

  const wallet = accounts.create(entropy);
  const privateKeyHex = secrets.str2hex(wallet.privateKey);
  return {
    shares: secrets.share(privateKeyHex, numShares, threshold),
    address: wallet.address,
  };
};

const createWalletFromShares = shares => {
  if (typeof shares !== 'object' || !shares.length) {
    throw new Error('invalid value passed for shares');
  }

  try {
    const privateKeyHex = secrets.combine(shares);
    if (!privateKeyHex) {
      return null;
    }

    const privateKey = secrets.hex2str(privateKeyHex);
    return accounts.privateKeyToAccount(privateKey);
  } catch (err) {
    return null;
  }
}

const createPrivateKeyFromShares = shares => {
  if (typeof shares !== 'object' || !shares.length) {
    throw new Error('invalid value passed for shares');
  }

  try {
    const privateKeyHex = secrets.combine(shares);
    if (!privateKeyHex) {
      return null;
    }

    return secrets.hex2str(privateKeyHex);
  } catch (err) {
    return null;
  }
}

const verifyShares = (shares, address) => {
  if (typeof address !== 'string') {
    throw new Error('invalid value passed for address');
  }

  const wallet = createWalletFromShares(shares);
  if (!wallet) {
    return false;
  }
  return wallet.address === address;
};

const signMessage = (shares, message) => {
  const wallet = createWalletFromShares(shares);
  if (!wallet) {
    throw new Error('invalid value passed for shares');
  }

  if (typeof message !== 'string' || message === '') {
    throw new Error('invalid value passed for message');
  }

  message = message.split('{address}').join(wallet.address);
  return wallet.sign(message);
};

const signTransaction = (shares, rawTx) => {
  const privateKeyString = createPrivateKeyFromShares(shares).substring(2);
  console.log(privateKeyString);
  console.log('rawTx', rawTx);
  var privateKey = new Buffer(privateKeyString, 'hex')

  var tx = new Tx(rawTx);
  tx.sign(privateKey);

  var serializedTx = tx.serialize();
  return '0x' + serializedTx.toString('hex');
};

module.exports = {
  createWallet,
  verifyShares,
  signMessage,
  signTransaction
}
