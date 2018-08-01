const readFiles = require('read-files-promise');

const eth = require('../../lib/eth');
const utils = require('../utils');

const logError = err => {
  if (err) {
    console.log(err);
    process.exit(-1);
  }
}

const usbBasePath = utils.getUsbBasePath();

const signMessage = (walletName, usbNumbers, message) => {
  const splitFiles = usbNumbers.trim().split(' ').map(num => `${usbBasePath}/${walletName}-${num}/split.txt`);
  readFiles(splitFiles, { encoding: 'utf8' })
    .then(
      shares => {
        console.log("\n\n");
        const signedMsg = eth.signMessage(shares, message);
        console.log(signedMsg);
        console.log("\n\n");
        return signedMsg;
      },
      logError);
}

const signTransaction = (walletName, usbNumbers, message) => {
  const splitFiles = usbNumbers.trim().split(' ').map(num => `${usbBasePath}/${walletName}-${num}/split.txt`);
  return new Promise(function (resolve, reject) {
    readFiles(splitFiles, { encoding: 'utf8' }).then (shares => {
      console.log("\n\n");
      const signedMsg = eth.signTransaction(shares, message);
      console.log(signedMsg);
      console.log("\n\n");
      //  signedMsg;
      resolve(signedMsg);
    }, err => {
      reject(err);
    });
  });
}
module.exports = {
  signMessage,
  signTransaction
}


