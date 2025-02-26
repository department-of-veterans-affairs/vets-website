const {
  buildDefaultLoggerOptions,
  createLogger,
  setLoggerOutput,
} = require('./loggerHelpers');

const loggerOptions = buildDefaultLoggerOptions();

const logger = createLogger(loggerOptions);

module.exports = setLoggerOutput(logger);
