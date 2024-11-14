import { expect } from 'chai';

const winston = require('winston');
const sinon = require('sinon');
const fs = require('fs');
const {
  buildDefaultLoggerOptions,
  getVersionNumber,
  createLogger,
  setLoggerOutput,
  getDatadogTags,
  getLogLevel,
} = require('../../utils/loggerHelpers');

describe('loggerHelpers', () => {
  describe('buildDefaultLoggerOptions', () => {
    it('should return an object with the correct properties when not localhost', () => {
      process.env.LOG_LEVEL = 'debug';
      process.env.HOST_NAME = 'dev';
      const loggerOptionsExpected = {
        // minimum level of logs to display
        level: 'debug',
        exitOnError: false,
        // format logs as JSON by default
        format: expect.anything(),
      };

      loggerOptionsExpected.defaultMeta = {
        ddsource: 'nodejs',
        ddtags: getDatadogTags(),
        hostname: process.env.HOST_NAME,
        service: process.env.DATADOG_APP_NAME,
      };

      const loggerOptionsActual = buildDefaultLoggerOptions();
      expect(loggerOptionsActual).toEqual(loggerOptionsExpected);
    });
    it('should return an object with the correct properties when localhost', () => {
      process.env.LOG_LEVEL = 'debug';
      process.env.HOST_NAME = 'localhost';
      const loggerOptionsExpected = {
        // minimum level of logs to display
        level: 'debug',
        exitOnError: false,
        // format logs as JSON by default
        format: expect.anything(),
      };

      const loggerOptionsActual = buildDefaultLoggerOptions();
      expect(loggerOptionsActual).toEqual(loggerOptionsExpected);
    });
    it('should return an object with the correct properties when log level is not debug', () => {
      process.env.LOG_LEVEL = 'warn';
      process.env.HOST_NAME = 'localhost';
      const loggerOptionsExpected = {
        // minimum level of logs to display
        level: getLogLevel(),
        exitOnError: false,
        // format logs as JSON by default
        format: expect.anything(),
      };

      const loggerOptionsActual = buildDefaultLoggerOptions();
      expect(loggerOptionsActual).toEqual(loggerOptionsExpected);
    });
    it("should default to localhost when host name isn't provided", () => {
      process.env.LOG_LEVEL = 'debug';
      process.env.HOST_NAME = '';

      const loggerOptionsExpected = {
        // minimum level of logs to display
        level: 'debug',
        exitOnError: false,
        // format logs as JSON by default
        format: expect.anything(),
      };

      const loggerOptionsActual = buildDefaultLoggerOptions();
      expect(loggerOptionsActual).toEqual(loggerOptionsExpected);
    });
  });
  describe('getVersionNumber', () => {
    it('should get the version number', () => {
      const readFileSyncStub = sinon.stub(fs, 'readFileSync');
      readFileSyncStub.returns('{"version":"1.0.1"}');

      const versionNumber = getVersionNumber();

      const mockVersionNumber = '1.0.1';

      expect(versionNumber).toEqual(mockVersionNumber);
      readFileSyncStub.restore();
    });
  });
  describe('getDatadogTags', () => {
    it('should get the datadog tags when datadog tags are undefined', () => {
      const datadogTags = getDatadogTags();

      const mockDatadogTags = 'version:1.0.0';
      expect(datadogTags).toEqual(mockDatadogTags);
    });
    it('should get the datadog tags when datadog tags are defined', () => {
      process.env.DATADOG_TAGS = 'env:localhost,team:virtual-agent-platform';
      const datadogTags = getDatadogTags();

      const mockDatadogTags =
        'version:1.0.0,env:localhost,team:virtual-agent-platform';
      expect(datadogTags).toEqual(mockDatadogTags);
    });
  });
  describe('getLogLevel', () => {
    it('should get the log level when log level is defined', () => {
      process.env.LOG_LEVEL = 'debug';
      const logLevel = getLogLevel();

      const mockLogLevel = 'debug';
      expect(logLevel).toEqual(mockLogLevel);
    });
    it('should get the log level when log level is undefined', () => {
      delete process.env.LOG_LEVEL;
      const logLevel = getLogLevel();

      const mockLogLevel = 'info';
      expect(logLevel).toEqual(mockLogLevel);
    });
  });
  describe('createLogger', () => {
    it('should create the logger with correct logger options', () => {
      const createLoggerStub = sinon.stub(winston, 'createLogger');
      createLoggerStub.returns('logger');

      const actual = createLogger('fake logger options');

      expect(actual).toEqual('logger');
      expect(createLoggerStub.firstCall.args[0]).toEqual('fake logger options');
      createLoggerStub.restore();
    });
  });
  describe('setLoggerOutput', () => {
    it('should add http transport to the logger when not localhost', () => {
      const fakeLogger = {
        add: sinon.spy(),
      };
      process.env.HOST_NAME = 'dev';
      process.env.DATADOG_API_KEY = 'some_api_key';
      process.env.DATADOG_APP_NAME = 'some_app_name';
      const httpTransportOptions = {
        host: 'http-intake.logs.ddog-gov.com',
        path: `/api/v2/logs?dd-api-key=${
          process.env.DATADOG_API_KEY
        }&ddsource=nodejs&service=${process.env.DATADOG_APP_NAME}`,
        ssl: true,
        handleExceptions: true,
        handleRejections: true, // handle promise rejections
      };

      setLoggerOutput(fakeLogger);

      const format = winston.format.combine(
        winston.format.splat(),
        winston.format.printf(({ message }) => {
          return `${message}`;
        }),
      );
      expect(JSON.stringify(fakeLogger.add.firstCall.args[0])).toEqual(
        JSON.stringify(
          new winston.transports.Console({
            format,
            handleExceptions: true,
            handleRejections: true,
          }),
        ),
      );
      expect(JSON.stringify(fakeLogger.add.secondCall.args[0])).toEqual(
        JSON.stringify(new winston.transports.Http(httpTransportOptions)),
      );
    });
    it('should add console transport to the logger when localhost', () => {
      const fakeLogger = {
        add: sinon.spy(),
      };
      process.env.HOST_NAME = 'localhost';

      setLoggerOutput(fakeLogger);

      const format = winston.format.combine(
        winston.format.splat(),
        winston.format.printf(({ message }) => {
          return `${message}`;
        }),
      );
      expect(JSON.stringify(fakeLogger.add.firstCall.args[0])).toEqual(
        JSON.stringify(
          new winston.transports.Console({
            format,
            handleExceptions: true,
            handleRejections: true,
          }),
        ),
      );
    });
  });
});
