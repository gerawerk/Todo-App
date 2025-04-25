const colors = require('colors/safe');

module.exports = {
  info: (message) => console.log(colors.blue(`[INFO] ${message}`)),
  error: (message) => console.error(colors.red(`[ERROR] ${message}`)),
  warn: (message) => console.warn(colors.yellow(`[WARN] ${message}`))
};