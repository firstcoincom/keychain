const writeFile = require('write');
const readFiles = require('read-files-promise');

const eth = require('../../lib/eth');
const utils = require('../utils');

const logText = text => console.log(`\n============${text}================\n`)
const usbBasePath = utils.getUsbBasePath();

const getRandom = (arr, n) => {
  let result = new Array(n),
    len = arr.length,
    taken = new Array(len);
  if (n > len) {
    throw new RangeError("getRandom: more elements taken than available");
  }
  while (n--) {
    const x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

const verifyKeys = (walletName, numShares, threshold, address) => {

  logText("verify keys");
  const files = [];
  for (let i = 1; i <= numShares; i++) {
    const splitFilename = `${usbBasePath}/${walletName}-${i}/split.txt`;
    files.push(splitFilename);
  }

  for (let i = 1; i <= numShares; i++) {
    const randomFiles = getRandom(files, threshold);
    const promises = [];

    promises.push(
      readFiles(randomFiles, { encoding: 'utf8' })
        .then(shares => {
          return eth.verifyShares(shares, address);
        })
    );

    return Promise.all(promises).then(validArray => {
      return validArray.reduce((res, valid) => {
        res = res && valid;
      }, true);
    }).catch(
      err => { throw err; }
    );
  }
}

const createSplitKeys = (walletName, entropy, numShares, threshold) => {
  // create wallet with split keys
  logText("creating wallet");

    const data = eth.createWallet(entropy, numShares, threshold);
    // write files to pendrive
    logText("writing split keys");
    const promises = [];

    data.shares.forEach((share, index) => {
      const splitFilename = `${usbBasePath}/${walletName}-${index + 1}/split.txt`;
      const addressFilename = `${usbBasePath}/${walletName}-${index + 1}/address.txt`;

      promises.push(writeFile(splitFilename, share));
      promises.push(writeFile(addressFilename, data.address));
    });

    return Promise.all(promises).then(() => {
      return verifyKeys(walletName,numShares, threshold, data.address)
    }).catch(err => {
      throw err;
    });
}

module.exports = {
  createSplitKeys
}
