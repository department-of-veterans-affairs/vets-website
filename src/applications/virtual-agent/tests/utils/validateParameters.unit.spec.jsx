import { expect } from 'chai';
import sinon from 'sinon';
import * as Sentry from '@sentry/browser';

import validateParameters from '../../utils/validateParameters';
import { ERROR } from '../../utils/loadingStatus';
import * as logging from '../../utils/logging';

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

    it('should not call setParamLoadingStatus if all parameters are valid', () => {
      const setParamLoadingStatus = sandbox.spy();

      validateParameters({
        csrfToken,
        apiSession,
        userFirstName,
        userUuid,
        setParamLoadingStatus,
      });

      expect(setParamLoadingStatus.notCalled).to.be.true;
    });

    it('should call setParamLoadingStatus with ERROR if any parameter is missing', () => {
      const setParamLoadingStatus = sandbox.spy();

      validateParameters({
        csrfToken: null,
        apiSession,
        userFirstName,
        userUuid,
        setParamLoadingStatus,
      });

      expect(setParamLoadingStatus.calledOnce).to.be.true;
      expect(setParamLoadingStatus.calledWithExactly(ERROR));
    });

    it('should capture exception when csrfToken is missing', () => {
      const setParamLoadingStatus = sandbox.spy();
      const captureExceptionStub = sandbox.stub(
        Sentry,
        Sentry.captureException.name,
      );
      const logErrorToDatadogStub = sandbox.stub(logging, 'logErrorToDatadog');

      validateParameters({
        csrfToken: null,
        apiSession,
        userFirstName,
        userUuid,
        setParamLoadingStatus,
      });

      expect(captureExceptionStub.calledOnce).to.be.true;
      expect(
        captureExceptionStub.calledWith(
          new TypeError(
            'Virtual Agent chatbot bad start - missing required variables: {"csrfToken":null}',
          ),
        ),
      );

      expect(logErrorToDatadogStub.calledOnce).to.be.true;
      expect(
        logErrorToDatadogStub.calledWith(
          new TypeError(
            'Virtual Agent chatbot bad start - missing required variables: {"csrfToken":null}',
          ),
        ),
      );
    });
    it('should capture exception when apiSession is missing', () => {
      const setParamLoadingStatus = sandbox.spy();
      const captureExceptionStub = sandbox.stub(
        Sentry,
        Sentry.captureException.name,
      );
      const logErrorToDatadogStub = sandbox.stub(logging, 'logErrorToDatadog');

      validateParameters({
        csrfToken,
        apiSession: null,
        userFirstName,
        userUuid,
        setParamLoadingStatus,
      });

      expect(captureExceptionStub.calledOnce).to.be.true;
      expect(
        captureExceptionStub.calledWith(
          new TypeError(
            'Virtual Agent chatbot bad start - missing required variables: {"apiSession":null}',
          ),
        ),
      );

      expect(logErrorToDatadogStub.calledOnce).to.be.true;
      expect(
        logErrorToDatadogStub.calledWith(
          new TypeError(
            'Virtual Agent chatbot bad start - missing required variables: {"apiSession":null}',
          ),
        ),
      );
    });
    it('should capture exception when userFirstName is not a string', () => {
      const setParamLoadingStatus = sandbox.spy();
      const captureExceptionStub = sandbox.stub(
        Sentry,
        Sentry.captureException.name,
      );

      const logErrorToDatadogStub = sandbox.stub(logging, 'logErrorToDatadog');

      validateParameters({
        csrfToken,
        apiSession,
        userFirstName: 1,
        userUuid,
        setParamLoadingStatus,
      });

      expect(captureExceptionStub.calledOnce).to.be.true;
      expect(
        captureExceptionStub.calledWith(
          new TypeError(
            'Virtual Agent chatbot bad start - missing required variables: {"apiSession":null}',
          ),
        ),
      );

      expect(logErrorToDatadogStub.calledOnce).to.be.true;
      expect(
        logErrorToDatadogStub.calledWith(
          new TypeError(
            'Virtual Agent chatbot bad start - missing required variables: {"apiSession":null}',
          ),
        ),
      );
    });
    it('should capture exception when userUuid is not a string', () => {
      const setParamLoadingStatus = sandbox.spy();
      const captureExceptionStub = sandbox.stub(
        Sentry,
        Sentry.captureException.name,
      );

      const logErrorToDatadogStub = sandbox.stub(logging, 'logErrorToDatadog');

      validateParameters({
        csrfToken,
        apiSession,
        userFirstName,
        userUuid: 1,
        setParamLoadingStatus,
      });

      expect(captureExceptionStub.calledOnce).to.be.true;
      expect(
        captureExceptionStub.calledWith(
          new TypeError(
            'Virtual Agent chatbot bad start - missing required variables: {"apiSession":null}',
          ),
        ),
      );

      expect(logErrorToDatadogStub.calledOnce).to.be.true;
      expect(
        logErrorToDatadogStub.calledWith(
          new TypeError(
            'Virtual Agent chatbot bad start - missing required variables: {"apiSession":null}',
          ),
        ),
      );
    });
  });
});
