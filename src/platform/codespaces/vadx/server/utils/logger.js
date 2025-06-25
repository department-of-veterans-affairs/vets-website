/* eslint-disable no-console */
const chalk = require('chalk');

/**
 * @typedef {(name: string, type: string, message: string|Buffer) => void} ProcessFn
 * Process-specific logging function
 */

/**
 * @typedef {(...args: any[]) => void} LoggerFn
 * Generic logger function
 */

/**
 * @typedef {Object} Logger
 * @property {LoggerFn} info - log blue message with `[INFO]` prefix
 * @property {LoggerFn} success - log green message with `[SUCCESS]` prefix
 * @property {LoggerFn} warn - log yellow message with `[WARN]` prefix
 * @property {LoggerFn} error - log red message with `[ERROR]` prefix
 * @property {LoggerFn} debug - log gray message with `[DEBUG]` prefix
 * @property {ProcessFn} process - log process-specific messages with name and type
 */

/**
 * Logger for server-side logging with colored output.
 * Only creates this logger when running in Node.js environment.
 * Returns a no-op logger in non-Node environments to prevent accidental logging.
 *
 * @type {Logger}
 *
 * @example
 * logger.info('Server started on port 3000');
 * logger.success('Database connected successfully');
 * logger.warn('Rate limit approaching');
 * logger.error('Failed to connect to database');
 * logger.debug(data);
 *
 * // Log process-specific messages, red for stderr type, blue for stdout or other types
 * logger.process('Server', 'stdout', 'Server initialized');
 * logger.process('Worker', 'stderr', 'Memory limit exceeded');
 *
 * // Handling Buffer messages
 * const buf = Buffer.from('Process output');
 * logger.process('Process', 'stdout', buf);
 */
const logger =
  typeof process !== 'undefined' && process.versions?.node
    ? {
        info: (...args) => console.log(chalk.blue('[INFO]'), ...args),
        success: (...args) => console.log(chalk.green('[SUCCESS]'), ...args),
        warn: (...args) => console.log(chalk.yellow('[WARN]'), ...args),
        error: (...args) => console.log(chalk.red('[ERROR]'), ...args),
        debug: (...args) => console.log(chalk.gray('[DEBUG]'), ...args),
        /**
         * Log process-specific messages
         * @type {ProcessFn}
         */
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
