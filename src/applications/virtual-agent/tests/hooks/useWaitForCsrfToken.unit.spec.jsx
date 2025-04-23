import { expect } from 'chai';
import sinon from 'sinon';
import * as ReactRedux from 'react-redux';
import { renderHook } from '@testing-library/react-hooks';
import * as Sentry from '@sentry/browser';
import { useWaitForCsrfToken } from '../../hooks/useWaitForCsrfToken';
import * as LoggingModule from '../../utils/logging';
import * as UseDatadogLoggingModule from '../../hooks/useDatadogLogging';

describe('useWaitForCsrfToken', () => {
  let sandbox;
  let clock;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    clock = sandbox.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout'],
    });
  });

  afterEach(() => {
    sandbox.restore();
    clock.restore();
  });

  it('should set error and call sentry when csrf token loading times out and call Datadog if flag is enabled', async () => {
    sandbox.stub(ReactRedux, ReactRedux.useSelector.name).returns(true);

    const SentryCaptureExceptionSpy = sandbox.spy();
    sandbox
      .stub(Sentry, 'captureException')
      .callsFake(SentryCaptureExceptionSpy);

    sandbox.stub(UseDatadogLoggingModule, 'useDatadogLogging').returns(true);

    const logErrorToDatadogSpy = sandbox.spy();
    sandbox
      .stub(LoggingModule, 'logErrorToDatadog')
      .callsFake(logErrorToDatadogSpy);

    const { result } = renderHook(() => useWaitForCsrfToken({ timeout: 1 }));
    clock.tick(1);

    expect(result.current[0]).to.equal(true);
    expect(result.current[1]).to.equal(true);
    expect(SentryCaptureExceptionSpy.calledOnce).to.be.true;
    expect(SentryCaptureExceptionSpy.args[0][0]).to.be.an.instanceOf(Error);
    expect(SentryCaptureExceptionSpy.args[0][0].message).to.equal(
      'Could not load feature toggles within timeout',
    );
    expect(logErrorToDatadogSpy.calledOnce).to.be.true;
    expect(logErrorToDatadogSpy.args[0][0]).to.be.true;
    expect(logErrorToDatadogSpy.args[0][1]).to.equal(
      'Could not load feature toggles within timeout',
    );
    expect(logErrorToDatadogSpy.args[0][2]).to.be.an.instanceOf(Error);
  });
  it('should not call sentry when csrf token loads in time', async () => {
    const SentryCaptureExceptionSpy = sandbox.spy();

    sandbox.stub(ReactRedux, ReactRedux.useSelector.name).returns(false);

    sandbox
      .stub(Sentry, 'captureException')
      .callsFake(SentryCaptureExceptionSpy);

    sandbox.stub(UseDatadogLoggingModule, 'useDatadogLogging').returns(false);

    const logErrorToDatadogSpy = sandbox.spy();
    sandbox
      .stub(LoggingModule, 'logErrorToDatadog')
      .callsFake(logErrorToDatadogSpy);

    const { result } = renderHook(() => useWaitForCsrfToken({ timeout: 1 }));
    clock.tick(1);

    expect(result.current[0]).to.equal(false);
    expect(result.current[1]).to.equal(false);
    expect(SentryCaptureExceptionSpy.calledOnce).to.be.false;
    expect(logErrorToDatadogSpy.called).to.be.false;
  });
});
