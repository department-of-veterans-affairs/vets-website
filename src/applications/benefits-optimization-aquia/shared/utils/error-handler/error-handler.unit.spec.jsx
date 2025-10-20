import { expect } from 'chai';
import sinon from 'sinon';

import { ErrorCode } from '../error-constants';
import { ErrorHandler } from './error-handler';
import { FormError } from '../form-error';
import { logger } from '../logger';

describe('Error Handler - Error processing', () => {
  describe('ErrorHandler', () => {
    let handler;

    beforeEach(() => {
      handler = new ErrorHandler();
    });

    describe('handleError', () => {
      it('processes FormError', () => {
        const error = new FormError('Test error', {
          code: ErrorCode.VALIDATION_ERROR,
        });

        const result = handler.handleError(error);
        expect(result).to.have.property('handled', true);
        expect(result).to.have.property('displayMessage');
      });

      it('processes regular Error', () => {
        const error = new Error('Regular error');
        const result = handler.handleError(error);
        expect(result).to.have.property('handled', true);
      });

      it('handle string error', () => {
        const result = handler.handleError('String error');
        expect(result).to.have.property('handled', true);
        expect(result.displayMessage).to.equal('String error');
      });

      it('log errors to console', () => {
        const loggerStub = sinon.stub(logger, 'error');
        const error = new Error('Test');
        handler.handleError(error);
        expect(loggerStub.called).to.be.true;
        loggerStub.restore();
      });
    });

    describe('registerHandler', () => {
      it('register custom error handler', () => {
        const customHandler = sinon.spy(() => ({
          handled: true,
          displayMessage: 'Custom handled',
        }));

        handler.registerHandler(ErrorCode.NETWORK_ERROR, customHandler);

        const error = new FormError('Network', {
          code: ErrorCode.NETWORK_ERROR,
        });
        const result = handler.handleError(error);

        expect(customHandler.called).to.be.true;
        expect(result.displayMessage).to.equal('Custom handled');
      });
    });

    describe('setOptions', () => {
      it('update handler options', () => {
        const loggerStub = sinon.stub(logger, 'error');
        handler.setOptions({ logToConsole: false });

        const error = new Error('Test');
        handler.handleError(error);

        expect(loggerStub.called).to.be.false;
        loggerStub.restore();
      });
    });
  });
});
