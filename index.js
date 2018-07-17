const eth = require('./lib/eth');
const key = require('./commands/eth/create-split-keys.js');
const sign = require('./commands/eth/sign-message.js');

module.exports = {
  eth,
  key,
  sign
}