const prompt = require('prompt');
const write = require('write');
const readFiles = require('read-files-promise');
const fs = require('fs');

const eth = require('../../lib/eth');
const utils = require('../utils');

const logError = err => {
  if (err) {
    console.log(err);
    process.exit(-1);
  }
}

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

const verifyKeys = (numShares, threshold, address) => {

  logText("verify keys"); 
  const files = [];
  for (let i = 1; i <= numShares; i++) {
    const splitFilename = `${usbBasePath}/${walletName}-${i}/split.txt`;
    files.push(splitFilename);
  }

  for (let i = 1; i <= numShares; i++) {
   
    const randomFiles = getRandom(files, threshold);
    const promises = [];

    var verified = true;
    promises.push(new Promise(function (resolve, reject) {
      readFiles(randomFiles, { encoding: 'utf8' }, function (shares) {
        const valid = eth.verifyShares(shares, address);
        verified = verified && valid;
        resolve(true);
      }, function (err) {
        reject(err);
      });
    }));

    return Promise.all(promises).then(function () {
      return verified;
    }).catch(function (err) {
      throw err;
    });
  }
}

const createSplitKeys = (walletName, entropy, numShares, threshold) => {
  // create wallet with split keys
  logText("creating wallet");
  const data = eth.createWallet(entropy, numShares, threshold);

  // write files to pendrive
  logText("writing split keys");

  const files = [];
  const promises = [];

  data.shares.forEach((share, index) => {
    const splitFilename = `${usbBasePath}/${walletName}-${index + 1}/split.txt`;
    const addressFilename = `${usbBasePath}/${walletName}-${index + 1}/address.txt`;
    files.push(splitFilename);

    promises.push(new Promise(function (resolve, reject) {
      write(splitFilename, share).then(function () {
        resolve(true);
      }).catch(function (err) {
        reject(err);
      });
    }));

    promises.push(new Promise(function (resolve, reject) {
      write(addressFilename, data.address).then(function () {
        resolve(true);
      }).catch(function (err) {
        reject(err);
      });
    }));
  });

  return Promise.all(promises).then(function () {
    console.log(data);
    return data;
  }).catch(function (err) {
    console.log(err);
    throw err;
  });
}

module.exports = {
  createSplitKeys,
  verifyKeys
}
