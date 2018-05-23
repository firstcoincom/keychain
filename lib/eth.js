const secrets = require('secrets.js-grempe');

const Accounts = require('web3-eth-accounts');
const accounts = new Accounts();

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

const verifyShares = (shares, address) => {
  if (typeof shares !== 'object' || !shares.length) {
    throw new Error('invalid value passed for shares');
  }

  if (typeof address !== 'string') {
    throw new Error('invalid value passed for address');
  }

  const privateKeyHex = secrets.combine(shares);
  if (!privateKeyHex) {
    return false;
  }
  const privateKey = secrets.hex2str(privateKeyHex);
  try {
    const wallet = accounts.privateKeyToAccount(privateKey);
    return wallet.address === address;
  } catch (err) {
    return false;
  }
};

module.exports = {
  createWallet,
  verifyShares,
}
