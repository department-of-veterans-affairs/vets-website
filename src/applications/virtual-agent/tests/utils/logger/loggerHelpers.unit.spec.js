import winston from 'winston';
import sinon from 'sinon';
import { expect } from 'chai';
import {
  buildDefaultLoggerOptions,
  createLogger,
  setLoggerOutput,
  getDatadogTags,
  getLogLevel,
} from '../../../utils/logger/loggerHelpers';

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
        format: sinon.match.any,
      };

      loggerOptionsExpected.defaultMeta = {
        ddsource: 'nodejs',
        ddtags: getDatadogTags(),
        hostname: process.env.HOST_NAME,
        service: process.env.DATADOG_APP_NAME,
      };

      const loggerOptionsActual = buildDefaultLoggerOptions();
      expect(loggerOptionsActual.level).to.equal('debug');
      expect(loggerOptionsActual.exitOnError).to.be.false;
      expect(loggerOptionsActual.defaultMeta).to.deep.equal({
        ddsource: 'nodejs',
        ddtags: getDatadogTags(),
        hostname: process.env.HOST_NAME,
        service: process.env.DATADOG_APP_NAME,
      });
      expect(loggerOptionsActual).to.have.property('format');
    });
    it('should return an object with the correct properties when localhost', () => {
      process.env.LOG_LEVEL = 'debug';
      process.env.HOST_NAME = 'localhost';

      const loggerOptionsActual = buildDefaultLoggerOptions();
      expect(loggerOptionsActual.level).to.equal('debug');
      expect(loggerOptionsActual.exitOnError).to.be.false;
      expect(loggerOptionsActual).to.have.property('format');
    });
    it('should return an object with the correct properties when log level is not debug', () => {
      process.env.LOG_LEVEL = 'warn';
      process.env.HOST_NAME = 'localhost';

      const loggerOptionsActual = buildDefaultLoggerOptions();
      expect(loggerOptionsActual.level).to.equal('warn');
      expect(loggerOptionsActual.exitOnError).to.be.false;
      expect(loggerOptionsActual).to.have.property('format');
    });
    it("should default to localhost when host name isn't provided", () => {
      process.env.LOG_LEVEL = 'debug';
      process.env.HOST_NAME = '';

      const loggerOptionsActual = buildDefaultLoggerOptions();
      expect(loggerOptionsActual.level).to.equal('debug');
      expect(loggerOptionsActual.exitOnError).to.be.false;
      expect(loggerOptionsActual).to.have.property('format');
    });
  });
  describe('getDatadogTags', () => {
    it('should get the datadog tags when datadog tags are undefined', () => {
      const datadogTags = getDatadogTags();

      const mockDatadogTags = 'version:1.0.1';
      expect(datadogTags).to.deep.equal(mockDatadogTags);
    });
    it('should get the datadog tags when datadog tags are defined', () => {
      process.env.DATADOG_TAGS = 'env:localhost,team:virtual-agent-platform';
      const datadogTags = getDatadogTags();

      const mockDatadogTags =
        'version:1.0.1,env:localhost,team:virtual-agent-platform';
      expect(datadogTags).to.deep.equal(mockDatadogTags);
    });
  });
  describe('getLogLevel', () => {
    it('should get the log level when log level is defined', () => {
      process.env.LOG_LEVEL = 'debug';
      const logLevel = getLogLevel();

      const mockLogLevel = 'debug';
      expect(logLevel).to.deep.equal(mockLogLevel);
    });
    it('should get the log level when log level is undefined', () => {
      delete process.env.LOG_LEVEL;
      const logLevel = getLogLevel();

      const mockLogLevel = 'info';
      expect(logLevel).to.deep.equal(mockLogLevel);
    });
  });
  describe('createLogger', () => {
    it('should create the logger with correct logger options', () => {
      const createLoggerStub = sinon.stub(winston, 'createLogger');
      createLoggerStub.returns('logger');

      const actual = createLogger('fake logger options');

      expect(actual).to.deep.equal('logger');
      expect(createLoggerStub.firstCall.args[0]).to.deep.equal(
        'fake logger options',
      );
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
      expect(JSON.stringify(fakeLogger.add.firstCall.args[0])).to.deep.equal(
        JSON.stringify(
          new winston.transports.Console({
            format,
            handleExceptions: true,
            handleRejections: true,
          }),
        ),
      );
      expect(JSON.stringify(fakeLogger.add.secondCall.args[0])).to.deep.equal(
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
      expect(JSON.stringify(fakeLogger.add.firstCall.args[0])).to.deep.equal(
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
