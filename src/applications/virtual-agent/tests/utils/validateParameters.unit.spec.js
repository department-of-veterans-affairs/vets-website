import { expect } from 'chai';
import sinon from 'sinon';
import * as Sentry from '@sentry/browser';

import validateParameters from '../../utils/validateParameters';
import { ERROR } from '../../utils/loadingStatus';

describe('validateParameters', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('validateParameters', () => {
    const csrfToken = 'csrfToken';
    const apiSession = 'apiSession';
    const userFirstName = 'John';
    const userUuid = '12345';

    it('should not call setParamLoadingStatusFn if all parameters are valid', () => {
      const setParamLoadingStatusFn = sandbox.spy();

      validateParameters({
        csrfToken,
        apiSession,
        userFirstName,
        userUuid,
        setParamLoadingStatusFn,
      });

      expect(setParamLoadingStatusFn.notCalled).to.be.true;
    });

    it('should call setParamLoadingStatusFn with ERROR if any parameter is missing', () => {
      const setParamLoadingStatusFn = sandbox.spy();

      validateParameters({
        csrfToken: null,
        apiSession,
        userFirstName,
        userUuid,
        setParamLoadingStatusFn,
      });

      expect(setParamLoadingStatusFn.calledOnce).to.be.true;
      expect(setParamLoadingStatusFn.calledWithExactly(ERROR));
    });

    it('should capture exception when csrfToken is missing', () => {
      const setParamLoadingStatusFn = sandbox.spy();
      const captureExceptionStub = sandbox.stub(
        Sentry,
        Sentry.captureException.name,
      );

      validateParameters({
        csrfToken: null,
        apiSession,
        userFirstName,
        userUuid,
        setParamLoadingStatusFn,
      });

      expect(captureExceptionStub.calledOnce).to.be.true;
      expect(
        captureExceptionStub.calledWith(
          new TypeError(
            'Virtual Agent chatbot bad start - missing required variables: {"csrfToken":null}',
          ),
        ),
      );
    });
    it('should capture exception when apiSession is missing', () => {
      const setParamLoadingStatusFn = sandbox.spy();
      const captureExceptionStub = sandbox.stub(
        Sentry,
        Sentry.captureException.name,
      );

      validateParameters({
        csrfToken,
        apiSession: null,
        userFirstName,
        userUuid,
        setParamLoadingStatusFn,
      });

      expect(captureExceptionStub.calledOnce).to.be.true;
      expect(
        captureExceptionStub.calledWith(
          new TypeError(
            'Virtual Agent chatbot bad start - missing required variables: {"apiSession":null}',
          ),
        ),
      );
    });
    it('should capture exception when userFirstName is not a string', () => {
      const setParamLoadingStatusFn = sandbox.spy();
      const captureExceptionStub = sandbox.stub(
        Sentry,
        Sentry.captureException.name,
      );

      validateParameters({
        csrfToken,
        apiSession,
        userFirstName: 1,
        userUuid,
        setParamLoadingStatusFn,
      });

      expect(captureExceptionStub.calledOnce).to.be.true;
      expect(
        captureExceptionStub.calledWith(
          new TypeError(
            'Virtual Agent chatbot bad start - missing required variables: {"apiSession":null}',
          ),
        ),
      );
    });
    it('should capture exception when userUuid is not a string', () => {
      const setParamLoadingStatusFn = sandbox.spy();
      const captureExceptionStub = sandbox.stub(
        Sentry,
        Sentry.captureException.name,
      );

      validateParameters({
        csrfToken,
        apiSession,
        userFirstName,
        userUuid: 1,
        setParamLoadingStatusFn,
      });

      expect(captureExceptionStub.calledOnce).to.be.true;
      expect(
        captureExceptionStub.calledWith(
          new TypeError(
            'Virtual Agent chatbot bad start - missing required variables: {"apiSession":null}',
          ),
        ),
      );
    });
  });
});
