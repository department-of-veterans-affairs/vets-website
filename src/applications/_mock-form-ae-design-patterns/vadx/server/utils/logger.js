/* eslint-disable no-console */
const chalk = require('chalk');

// Only create logger when in node env
const logger =
  typeof process !== 'undefined' && process.versions?.node
    ? {
        info: (...args) => console.log(chalk.blue('[INFO]'), ...args),
        success: (...args) => console.log(chalk.green('[SUCCESS]'), ...args),
        warn: (...args) => console.log(chalk.yellow('[WARN]'), ...args),
        error: (...args) => console.log(chalk.red('[ERROR]'), ...args),
        debug: (...args) => console.log(chalk.gray('[DEBUG]'), ...args),
        process: (name, type, message) => {
          const color = type === 'stderr' ? 'red' : 'blue';
          const text = Buffer.isBuffer(message) ? message.toString() : message;
          console.log(chalk[color](`[${name}] ${type}:`), text);
        },
      }
    : {
        info: () => {},
        success: () => {},
        warn: () => {},
        error: () => {},
        debug: () => {},
        process: () => {},
      };

module.exports = logger;
