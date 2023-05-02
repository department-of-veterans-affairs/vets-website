/* eslint-disable no-console */
const chalk = require('chalk');

// the next few functions are just for logging out messages
// and should be moved to a separate util file at some point
const warn = message => {
  console.log(chalk.hex('#FFA500')(message));
};

const error = message => {
  console.log(chalk.bold.red(message));
};

const info = message => {
  console.log(chalk.blue(message));
};

const success = message => {
  console.log(chalk.green(message));
};

// easy way to just log out messages when debugging locally
const debug = message => {
  if (process?.env?.AEDEBUG) {
    info(message);
  }
};

const delaySingleResponse = (cb, delay = 3000) => {
  setTimeout(() => {
    cb();
  }, delay);
};

module.exports = {
  warn,
  error,
  info,
  success,
  debug,
  delaySingleResponse,
};
