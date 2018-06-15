const prompt = require('prompt');
const readFiles = require('read-files-promise');
var QRCode = require('qrcode')

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
  readFiles(splitFiles, {encoding: 'utf8'})
  .then(
    shares => {
      console.log("\n\n");
      const signedMsgQR = "/home/pi/signedMsgQR.txt"
      const signedMsg = eth.signMessage(shares, message);
      console.log(signedMsg);
      utils.genQRCode(signedMsg, signedMsgQR);
      console.log("\n\n");
    },
    logError,
  ).catch(logError);
}

prompt.start();
prompt.get([
  'walletName',
  'usbNumbers',
  'message'
], (err, results) => {
  if (err) {
    console.log("unable to read inputs");
    return;
  }

  signMessage(results.walletName, results.usbNumbers, results.message);
});
