const prompt = require('prompt');
const readFiles = require('read-files-promise');

const eth = require('../../../lib/eth');

const logError = err => {
  if (err) {
    console.log(err);
    process.exit(-1);
  }
}

const signMessage = (walletName, usbNumbers, message) => {
  const splitFiles = usbNumbers.trim().split(' ').map(num => `/media/pi/${walletName}-${num}/split.txt`);
  readFiles(splitFiles, {encoding: 'utf8'})
  .then(
    shares => {
      console.log("\n\n");
      console.log(eth.signMessage(shares, message));
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
