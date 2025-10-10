import { expect } from 'chai';
import sinon from 'sinon';
import { logger } from './logger';

describe('Logger - Logging utility', () => {
  let consoleLogStub;
  let consoleErrorStub;
  let consoleWarnStub;
  let consoleInfoStub;
  let originalEnv;

  beforeEach(() => {
    // Save original environment
    originalEnv = process.env.NODE_ENV;
    // Set to test environment (which suppresses logging)
    process.env.NODE_ENV = 'development';

    // Restore any existing stubs first
    /* eslint-disable no-console */
    if (console.log.restore) console.log.restore();
    if (console.error.restore) console.error.restore();
    if (console.warn.restore) console.warn.restore();
    if (console.info.restore) console.info.restore();
    /* eslint-enable no-console */

    // Stub console methods
    consoleLogStub = sinon.stub(console, 'log');
    consoleErrorStub = sinon.stub(console, 'error');
    consoleWarnStub = sinon.stub(console, 'warn');
    consoleInfoStub = sinon.stub(console, 'info');
  });

  afterEach(() => {
    // Restore console methods if they exist
    if (consoleLogStub && consoleLogStub.restore) consoleLogStub.restore();
    if (consoleErrorStub && consoleErrorStub.restore)
      consoleErrorStub.restore();
    if (consoleWarnStub && consoleWarnStub.restore) consoleWarnStub.restore();
    if (consoleInfoStub && consoleInfoStub.restore) consoleInfoStub.restore();
    // Restore environment
    process.env.NODE_ENV = originalEnv;
  });

  describe('debug', () => {
    it('call console.log with [DEBUG] prefix in development', () => {
      logger.debug('Test message', { data: 'test' });
      expect(consoleLogStub.calledOnce).to.be.true;
      expect(consoleLogStub.firstCall.args[0]).to.include('[DEBUG]');
      expect(consoleLogStub.firstCall.args[0]).to.include('Test message');
      expect(consoleLogStub.firstCall.args[1]).to.deep.equal({ data: 'test' });
    });

    it('handle debug without additional data', () => {
      logger.debug('Simple debug');
      expect(consoleLogStub.calledOnce).to.be.true;
      expect(consoleLogStub.firstCall.args[0]).to.include('Simple debug');
      expect(consoleLogStub.firstCall.args[1]).to.equal('');
    });

    it('not log in test environment (unless ENABLE_TEST_LOGS=true)', () => {
      process.env.NODE_ENV = 'test';
      delete process.env.ENABLE_TEST_LOGS;
      logger.debug('Test message');
      expect(consoleLogStub.called).to.be.false;
    });
  });

  describe('info', () => {
    it('call console.info with [INFO] prefix', () => {
      logger.info('Info message', { status: 'success' });
      expect(consoleInfoStub.calledOnce).to.be.true;
      expect(consoleInfoStub.firstCall.args[0]).to.include('[INFO]');
      expect(consoleInfoStub.firstCall.args[0]).to.include('Info message');
      expect(consoleInfoStub.firstCall.args[1]).to.deep.equal({
        status: 'success',
      });
    });

    it('handle info without additional data', () => {
      logger.info('Simple info');
      expect(consoleInfoStub.calledOnce).to.be.true;
      expect(consoleInfoStub.firstCall.args[0]).to.include('Simple info');
      expect(consoleInfoStub.firstCall.args[1]).to.equal('');
    });

    it('not log in test environment (unless ENABLE_TEST_LOGS=true)', () => {
      process.env.NODE_ENV = 'test';
      delete process.env.ENABLE_TEST_LOGS;
      logger.info('Test message');
      expect(consoleInfoStub.called).to.be.false;
    });
  });

  describe('warn', () => {
    it('call console.warn with [WARN] prefix', () => {
      logger.warn('Warning message', { level: 'medium' });
      expect(consoleWarnStub.calledOnce).to.be.true;
      expect(consoleWarnStub.firstCall.args[0]).to.include('[WARN]');
      expect(consoleWarnStub.firstCall.args[0]).to.include('Warning message');
      expect(consoleWarnStub.firstCall.args[1]).to.deep.equal({
        level: 'medium',
      });
    });

    it('handle warning without additional data', () => {
      logger.warn('Simple warning');
      expect(consoleWarnStub.calledOnce).to.be.true;
      expect(consoleWarnStub.firstCall.args[0]).to.include('Simple warning');
      expect(consoleWarnStub.firstCall.args[1]).to.equal('');
    });

    it('not log in test environment (unless ENABLE_TEST_LOGS=true)', () => {
      process.env.NODE_ENV = 'test';
      delete process.env.ENABLE_TEST_LOGS;
      logger.warn('Test message');
      expect(consoleWarnStub.called).to.be.false;
    });
  });

  describe('error', () => {
    it('call console.error with [ERROR] prefix', () => {
      const error = new Error('Test error');
      logger.error('Error occurred', error);
      expect(consoleErrorStub.calledOnce).to.be.true;
      expect(consoleErrorStub.firstCall.args[0]).to.include('[ERROR]');
      expect(consoleErrorStub.firstCall.args[0]).to.include('Error occurred');
      expect(consoleErrorStub.firstCall.args[1]).to.equal(error);
    });

    it('handle Error objects', () => {
      const error = new Error('Test error');
      logger.error('Error message', error);
      expect(consoleErrorStub.calledOnce).to.be.true;
      expect(consoleErrorStub.firstCall.args[1]).to.be.instanceOf(Error);
    });

    it('handle string errors', () => {
      logger.error('Simple error message');
      expect(consoleErrorStub.calledOnce).to.be.true;
      expect(consoleErrorStub.firstCall.args[0]).to.include(
        'Simple error message',
      );
    });

    it('not log in test environment (unless ENABLE_TEST_LOGS=true)', () => {
      process.env.NODE_ENV = 'test';
      delete process.env.ENABLE_TEST_LOGS;
      logger.error('Test message');
      expect(consoleErrorStub.called).to.be.false;
    });
  });

  describe('timing', () => {
    it('log timing data in development', () => {
      logger.timing('form-validation', 123.45, { formId: 'test' });
      expect(consoleLogStub.calledOnce).to.be.true;
      expect(consoleLogStub.firstCall.args[0]).to.include('[TIMING]');
      expect(consoleLogStub.firstCall.args[0]).to.include('form-validation');
      expect(consoleLogStub.firstCall.args[0]).to.include('123.45ms');
    });

    it('handle timing without metadata', () => {
      logger.timing('operation', 50);
      expect(consoleLogStub.calledOnce).to.be.true;
      expect(consoleLogStub.firstCall.args[0]).to.include('50ms');
      expect(consoleLogStub.firstCall.args[1]).to.equal('');
    });

    it('not log in test environment (unless ENABLE_TEST_LOGS=true)', () => {
      process.env.NODE_ENV = 'test';
      delete process.env.ENABLE_TEST_LOGS;
      logger.timing('operation', 100);
      expect(consoleLogStub.called).to.be.false;
    });
  });

  describe('event', () => {
    it('log analytics events in development', () => {
      logger.event('form', 'submit', 'burial-flags', 1);
      expect(consoleLogStub.calledOnce).to.be.true;
      expect(consoleLogStub.firstCall.args[0]).to.equal('[EVENT]');
      expect(consoleLogStub.firstCall.args[1]).to.deep.equal({
        category: 'form',
        action: 'submit',
        label: 'burial-flags',
        value: 1,
      });
    });

    it('handle events without label and value', () => {
      logger.event('form', 'start');
      expect(consoleLogStub.calledOnce).to.be.true;
      expect(consoleLogStub.firstCall.args[1]).to.deep.equal({
        category: 'form',
        action: 'start',
        label: undefined,
        value: undefined,
      });
    });

    it('not log in test environment (unless ENABLE_TEST_LOGS=true)', () => {
      process.env.NODE_ENV = 'test';
      delete process.env.ENABLE_TEST_LOGS;
      logger.event('form', 'submit');
      expect(consoleLogStub.called).to.be.false;
    });
  });

  describe('withContext', () => {
    it('create a child logger with context prefix', () => {
      const formLogger = logger.withContext('BurialFlagsForm');
      expect(formLogger).to.have.property('debug');
      expect(formLogger).to.have.property('info');
      expect(formLogger).to.have.property('warn');
      expect(formLogger).to.have.property('error');
      expect(formLogger).to.have.property('timing');
      expect(formLogger).to.have.property('event');
    });

    it('prefix debug messages with context', () => {
      const formLogger = logger.withContext('TestContext');
      formLogger.debug('Debug message');
      expect(consoleLogStub.calledOnce).to.be.true;
      expect(consoleLogStub.firstCall.args[0]).to.include('[TestContext]');
      expect(consoleLogStub.firstCall.args[0]).to.include('Debug message');
    });

    it('prefix info messages with context', () => {
      const formLogger = logger.withContext('TestContext');
      formLogger.info('Info message');
      expect(consoleInfoStub.calledOnce).to.be.true;
      expect(consoleInfoStub.firstCall.args[0]).to.include('[TestContext]');
      expect(consoleInfoStub.firstCall.args[0]).to.include('Info message');
    });

    it('prefix error messages with context', () => {
      const formLogger = logger.withContext('TestContext');
      const error = new Error('Test');
      formLogger.error('Error message', error);
      expect(consoleErrorStub.calledOnce).to.be.true;
      expect(consoleErrorStub.firstCall.args[0]).to.include('[TestContext]');
      expect(consoleErrorStub.firstCall.args[0]).to.include('Error message');
    });

    it('prefix timing operations with context', () => {
      const formLogger = logger.withContext('TestContext');
      formLogger.timing('operation', 100);
      expect(consoleLogStub.calledOnce).to.be.true;
      expect(consoleLogStub.firstCall.args[0]).to.include(
        'TestContext.operation',
      );
    });

    it('prefix event categories with context', () => {
      const formLogger = logger.withContext('TestContext');
      formLogger.event('category', 'action');
      expect(consoleLogStub.calledOnce).to.be.true;
      expect(consoleLogStub.firstCall.args[1].category).to.equal(
        'TestContext.category',
      );
    });
  });

  describe('environment behavior', () => {
    it('log debug in development', () => {
      process.env.NODE_ENV = 'development';
      logger.debug('Dev debug');
      expect(consoleLogStub.calledOnce).to.be.true;
    });

    it('not log debug in production', () => {
      process.env.NODE_ENV = 'production';
      logger.debug('Prod debug');
      expect(consoleLogStub.called).to.be.false;
    });

    it('not log errors in production', () => {
      process.env.NODE_ENV = 'production';
      logger.error('Production error');
      expect(consoleErrorStub.called).to.be.false;
    });

    it('not log anything in test environment by default', () => {
      process.env.NODE_ENV = 'test';
      delete process.env.ENABLE_TEST_LOGS;

      logger.debug('Test debug');
      logger.info('Test info');
      logger.warn('Test warn');
      logger.error('Test error');
      logger.timing('test-op', 100);
      logger.event('test', 'action');

      expect(consoleLogStub.called).to.be.false;
      expect(consoleInfoStub.called).to.be.false;
      expect(consoleWarnStub.called).to.be.false;
      expect(consoleErrorStub.called).to.be.false;
    });

    it('log in test environment when ENABLE_TEST_LOGS=true', () => {
      process.env.NODE_ENV = 'test';
      process.env.ENABLE_TEST_LOGS = 'true';

      logger.debug('Test debug');
      logger.info('Test info');
      logger.warn('Test warn');
      logger.error('Test error');

      expect(consoleLogStub.called).to.be.true;
      expect(consoleInfoStub.called).to.be.true;
      expect(consoleWarnStub.called).to.be.true;
      expect(consoleErrorStub.called).to.be.true;

      // Clean up
      delete process.env.ENABLE_TEST_LOGS;
    });
  });

  describe('data handling', () => {
    it('handle null values', () => {
      logger.info('Null value', null);
      expect(consoleInfoStub.calledOnce).to.be.true;
      expect(consoleInfoStub.firstCall.args[1]).to.be.null;
    });

    it('handle undefined values', () => {
      logger.info('Undefined value', undefined);
      expect(consoleInfoStub.calledOnce).to.be.true;
      expect(consoleInfoStub.firstCall.args[1]).to.equal('');
    });

    it('handle objects', () => {
      const obj = { key: 'value', nested: { deep: true } };
      logger.info('Object value', obj);
      expect(consoleInfoStub.calledOnce).to.be.true;
      expect(consoleInfoStub.firstCall.args[1]).to.deep.equal(obj);
    });

    it('handle arrays', () => {
      const arr = [1, 2, 3, { nested: 'value' }];
      logger.info('Array value', arr);
      expect(consoleInfoStub.calledOnce).to.be.true;
      expect(consoleInfoStub.firstCall.args[1]).to.deep.equal(arr);
    });

    it('handle Error objects properly', () => {
      const error = new Error('Test error with stack');
      error.code = 'ERR_TEST';
      logger.error('Custom error', error);
      expect(consoleErrorStub.calledOnce).to.be.true;
      expect(consoleErrorStub.firstCall.args[1]).to.have.property(
        'message',
        'Test error with stack',
      );
      expect(consoleErrorStub.firstCall.args[1]).to.have.property(
        'code',
        'ERR_TEST',
      );
    });
  });
});
