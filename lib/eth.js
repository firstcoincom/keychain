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

const createWalletFromShares = shares => {
  if (typeof shares !== 'object' || !shares.length) {
    throw new Error('invalid value passed for shares');
  }

  const privateKeyHex = secrets.combine(shares);
  if (!privateKeyHex) {
    return false;
  }

  const privateKey = secrets.hex2str(privateKeyHex);
  try {
    return accounts.privateKeyToAccount(privateKey);
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

module.exports = {
  createWallet,
  verifyShares,
}
