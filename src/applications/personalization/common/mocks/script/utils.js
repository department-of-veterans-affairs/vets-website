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
const debug = message => {
  if (process?.env?.AEDEBUG) {
    info(message);
  }
};

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
  warn,
  error,
  info,
  success,
  debug,
  terminationHandler,
  boot,
};
