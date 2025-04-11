const winston = require('winston');
const path = require('path');

const ENV_FILE = path.join(
  path.dirname(path.dirname(path.dirname(__dirname))),
  '.env',
);
require('dotenv').config({ path: ENV_FILE });

const NODE_JS = 'nodejs';
const INFO = 'info';
const SERVICE = process.env.DATADOG_APP_NAME;
const HOST = 'http-intake.logs.ddog-gov.com';

function getLogLevel() {
  /**
   * This function reads the LOG_LEVEL environment variable and returns
   * either log level from env file or defaults to info
   */
  return (process.env.LOG_LEVEL || INFO).toLowerCase();
}

function isLocalHost() {
  const host = process.env.HOST_NAME
    ? process.env.HOST_NAME.toLowerCase()
    : 'localhost';
  return host === 'localhost';
}

function getDatadogTags() {
  return process.env.DATADOG_TAGS
    ? `version:1.0.1,${process.env.DATADOG_TAGS}`
    : `version:1.0.1`;
}

function buildDefaultLoggerOptions() {
  const loggerOptions = {
    // minimum level of logs to display
    level: getLogLevel(),
    exitOnError: false,
    // format logs as JSON by default
    format: winston.format.combine(
      winston.format.splat(),
      winston.format.json(),
    ),
  };

  if (!isLocalHost()) {
    // default metadata to be included when sent to datadog
    const ddtags = getDatadogTags();
    loggerOptions.defaultMeta = {
      ddsource: NODE_JS,
      ddtags,
      hostname: process.env.HOST_NAME,
      service: SERVICE,
    };
  }
  return loggerOptions;
}

function createLogger(loggerOptions) {
  return winston.createLogger(loggerOptions);
}

function setLoggerOutput(logger) {
  const format = winston.format.printf(({ message }) => {
    return `${message}`;
  });

  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.splat(), format),
      handleExceptions: true,
      handleRejections: true,
    }),
  );

  if (!isLocalHost()) {
    const httpTransportOptions = {
      host: HOST,
      path: `/api/v2/logs?dd-api-key=${process.env.DATADOG_API_KEY}&ddsource=nodejs&service=${process.env.DATADOG_APP_NAME}`,
      ssl: true,
      handleExceptions: true,
      handleRejections: true, // handle promise rejections
    };
    logger.add(new winston.transports.Http(httpTransportOptions));
  }
  return logger;
}

module.exports = {
  buildDefaultLoggerOptions,
  createLogger,
  setLoggerOutput,
  getDatadogTags,
  getLogLevel,
};
