/* eslint-disable no-console */
const chalk = require('chalk');
const _ = require('lodash');

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

const requestHistory = [];

const logRequest = req => {
  const { body, url, method, params, query } = req;
  const historyEntry = {};
  // only add variables to requestHistory if they are not empty
  if (!_.isEmpty(params)) {
    historyEntry.params = params;
  }
  if (!_.isEmpty(query)) {
    historyEntry.query = query;
  }

  if (!_.isEmpty(body)) {
    try {
      historyEntry.body = JSON.parse(body);
    } catch (e) {
      historyEntry.body = body;
    }
  }

  historyEntry.method = method;
  historyEntry.url = url;

  debug(JSON.stringify(requestHistory, null, 2));

  requestHistory.push({ ...historyEntry, url, method });
};

// this function will run once when the mock server is terminated, so we can do any cleanup here and make sure the server exits the process
function terminationHandler(signal) {
  debug(`\nReceived ${signal}`);
  process.env.HAS_RUN_AE_MOCKSERVER = false;
  process.exit();
}

const boot = cb => {
  // this runs once when the mock server starts up
  // uses a environment variable to prevent this from running more than once
  if (!process.env.HAS_RUN_AE_MOCKSERVER) {
    debug('BOOT');
    process.env.HAS_RUN_AE_MOCKSERVER = true;
    cb();

    process.on('SIGINT', terminationHandler);
    process.on('SIGTERM', terminationHandler);
    process.on('SIGQUIT', terminationHandler);
  }
};

module.exports = {
  boot,
  warn,
  error,
  info,
  success,
  debug,
  delaySingleResponse,
  requestHistory,
  logRequest,
};
