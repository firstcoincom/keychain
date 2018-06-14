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

const verifyKeys = (files, numShares, threshold, address) => {
  for(let i=1; i<=numShares; i++) {
    const randomFiles = getRandom(files, threshold);
    readFiles(randomFiles, {encoding: 'utf8'})
    .then(
      shares => {
        const valid = eth.verifyShares(shares, address);
        if (valid) {
          logText(`verification ${i} completed`);
        } else {
          console.log("unable to verify keys");
          process.exit(-1);
        }
      },
      logError
    );
  }
}

const createSplitKeysAndVerifyResults = (walletName, entropy, numShares, threshold) => {
  // create wallet with split keys
  logText("creating wallet");
  const data = eth.createWallet(entropy, numShares, threshold);

  // write files to pendrive
  logText("writing split keys");
  const files = [];
  data.shares.forEach((share, index) => {
    const splitFilename =`${usbBasePath}/${walletName}-${index + 1}/split.txt`;
    files.push(splitFilename);

    write(splitFilename, share, logError);
    write(`${usbBasePath}/${walletName}-${index + 1}/address.txt`, data.address, logError);

  });

  // verify created files
  logText("verifying keys");
  setTimeout(() => verifyKeys(files, numShares, threshold, data.address), 10);
}

const configFilePath = '~/qrinfo.json';

// run...
fs.access(configFilePath, fs.constants.R_OK, (err) => { // checks for read permissions
  if (err) {
    if (err.code === 'ENOENT') {
      console.error('~/qrinfo.json does not exist');
      return;
    }
    throw err;
  }

  fs.readFile('create-split-keys-config.json', (err, data) => {
    if(err) throw err;
    const results = JSON.parse(data);
    createSplitKeysAndVerifyResults(results.walletName, results.entropy, parseInt(results.numShares), parseInt(results.threshold));
  });
});

// prompt.start();
// prompt.get([
//   'walletName',
//   'entropy',
//   'numShares',
//   'threshold',
// ], (err, results) => {
//   if (err) {
//     console.log("unable to read inputs");
//     return;
//   }

//   createSplitKeysAndVerifyResults(results.walletName, results.entropy, parseInt(results.numShares), parseInt(results.threshold));
// });
