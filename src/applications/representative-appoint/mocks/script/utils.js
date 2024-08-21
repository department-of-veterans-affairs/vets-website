/* eslint-disable no-console */
const chalk = require('chalk');

// the next few functions are just for logging out messages
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
const debug = (message, status = 'info') => {
  const statusLookup = {
    warn,
    error,
    info,
    success,
  };
  if (process?.env?.AEDEBUG) {
    statusLookup[status](message);
  }
};

/**
 * delays a response by a given amount of seconds
 *
 * @param {!function} cb - callback function to fire after delay
 * @param {?number} delay - time to delay response in seconds (default: 3)
 */
const delaySingleResponse = (cb, delay = 3) => {
  setTimeout(() => {
    cb();
  }, delay * 1000);
};

module.exports = {
  warn,
  error,
  info,
  success,
  debug,
  delaySingleResponse,
};
