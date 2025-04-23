import { expect } from 'chai';
import sinon from 'sinon';
import { describe, it } from 'mocha';
import * as Sentry from '@sentry/browser';
import { act } from 'react-dom/test-utils';
import { renderHook } from '@testing-library/react-hooks';
import * as ApiModule from '@department-of-veterans-affairs/platform-utilities/api';
import * as RetryOnce from '../../utils/retryOnce';
import useVirtualAgentToken, {
  callVirtualAgentTokenApi,
} from '../../hooks/useVirtualAgentToken';
import { ERROR, COMPLETE } from '../../utils/loadingStatus';
import * as UseWaitForCsrfTokenModule from '../../hooks/useWaitForCsrfToken';
import * as LoggingModule from '../../utils/logging';
import * as UseDatadogLoggingModule from '../../hooks/useDatadogLogging';

describe('useVirtualAgentToken', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('callVirtualAgentTokenApi', () => {
    it('should return a function that uses MSFT PVA', () => {
      const virtualAgentEnableMsftPvaTesting = true;
      const virtualAgentEnableNluPvaTesting = false;
      const apiSpy = sandbox.spy();

      callVirtualAgentTokenApi(
        virtualAgentEnableMsftPvaTesting,
        virtualAgentEnableNluPvaTesting,
        apiSpy,
      )();

      expect(apiSpy.calledOnce).to.be.true;
      expect(apiSpy.args[0][0]).to.be.equal('/virtual_agent_token_msft');
      expect(apiSpy.args[0][1]).to.be.eql({
        method: 'POST',
      });
    });
    it('should return a function that uses standard PVA', () => {
      const virtualAgentEnableMsftPvaTesting = false;
      const virtualAgentEnableNluPvaTesting = false;
      const apiSpy = sandbox.spy();
      callVirtualAgentTokenApi(
        virtualAgentEnableMsftPvaTesting,
        virtualAgentEnableNluPvaTesting,
        apiSpy,
      )();
      expect(apiSpy.calledOnce).to.be.true;
      expect(apiSpy.args[0][0]).to.be.equal('/virtual_agent_token');
      expect(apiSpy.args[0][1]).to.be.eql({
        method: 'POST',
      });
    });
    it('should return a function that uses NLU PVA', () => {
      const virtualAgentEnableMsftPvaTesting = false;
      const virtualAgentEnableNluPvaTesting = true;
      const apiSpy = sandbox.spy();
      callVirtualAgentTokenApi(
        virtualAgentEnableMsftPvaTesting,
        virtualAgentEnableNluPvaTesting,
        apiSpy,
      )();
      expect(apiSpy.calledOnce).to.be.true;
      expect(apiSpy.args[0][0]).to.be.equal('/virtual_agent_token_nlu');
      expect(apiSpy.args[0][1]).to.be.eql({ method: 'POST' });
    });
  });
  describe('useVirtualAgentToken', () => {
    it('should return error for loading status when csrf loading fails', async () => {
      sandbox
        .stub(
          UseWaitForCsrfTokenModule,
          UseWaitForCsrfTokenModule.useWaitForCsrfToken.name,
        )
        .returns([true, true]);

      sandbox.stub(UseDatadogLoggingModule, 'useDatadogLogging').returns(true);

      let result;
      await act(async () => {
        result = renderHook(() =>
          useVirtualAgentToken({
            timeout: 1,
          }),
        );
      });

      expect(result.result.current.loadingStatus).to.equal(ERROR);
    });
    it('should return token, loadingStatus, and apiSession when csrf token loads', async () => {
      sandbox
        .stub(
          UseWaitForCsrfTokenModule,
          UseWaitForCsrfTokenModule.useWaitForCsrfToken.name,
        )
        .returns([false, false]);
      sandbox.stub(RetryOnce, 'default').resolves({
        token: 'abc',
        apiSession: 'ghi',
      });

      sandbox.stub(UseDatadogLoggingModule, 'useDatadogLogging').returns(true);

      let result;
      await act(async () => {
        result = renderHook(() => useVirtualAgentToken({ timeout: 1 }));
      });

      expect(result.result.current.token).to.equal('abc');
      expect(result.result.current.loadingStatus).to.equal(COMPLETE);
      expect(result.result.current.apiSession).to.equal('ghi');
    });
    it('should call Sentry and Datadog when an exception is thrown and the Datadog feature flag is enabled', async () => {
      sandbox
        .stub(
          UseWaitForCsrfTokenModule,
          UseWaitForCsrfTokenModule.useWaitForCsrfToken.name,
        )
        .returns([false, false]);
      sandbox
        .stub(ApiModule, ApiModule.apiRequest.name)
        .throws(new Error('test'));

      sandbox.stub(UseDatadogLoggingModule, 'useDatadogLogging').returns(true);

      const logErrorToDatadogSpy = sandbox.spy();
      sandbox
        .stub(LoggingModule, 'logErrorToDatadog')
        .callsFake(logErrorToDatadogSpy);

      const SentryCaptureExceptionSpy = sandbox.spy();
      sandbox
        .stub(Sentry, 'captureException')
        .callsFake(SentryCaptureExceptionSpy);

      let result;
      await act(async () => {
        result = renderHook(() =>
          useVirtualAgentToken({
            timeout: 1,
          }),
        );
      });

      expect(result.result.current.loadingStatus).to.equal(ERROR);
      expect(logErrorToDatadogSpy.args[0][0]).to.be.true;
      expect(logErrorToDatadogSpy.args[0][1]).to.equal(
        'vets-website - useVirtualAgentToken',
      );
      // 'Could not retrieve virtual agent token',
      expect(logErrorToDatadogSpy.args[0][2]).to.be.an.instanceOf(Error);
      expect(SentryCaptureExceptionSpy.args[0][0]).to.be.an.instanceOf(Error);
      expect(SentryCaptureExceptionSpy.args[0][0].message).to.equal(
        'Could not retrieve virtual agent token',
      );
    });
    it('should call Sentry and not call Datadog when an exception is thrown and the Datadog feature flag is disabled', async () => {
      sandbox
        .stub(
          UseWaitForCsrfTokenModule,
          UseWaitForCsrfTokenModule.useWaitForCsrfToken.name,
        )
        .returns([false, false]);
      sandbox
        .stub(ApiModule, ApiModule.apiRequest.name)
        .throws(new Error('test'));

      sandbox.stub(UseDatadogLoggingModule, 'useDatadogLogging').returns(false);

      const logErrorToDatadogSpy = sandbox.spy();
      sandbox
        .stub(LoggingModule, 'logErrorToDatadog')
        .callsFake(logErrorToDatadogSpy);

      const SentryCaptureExceptionSpy = sandbox.spy();
      sandbox
        .stub(Sentry, 'captureException')
        .callsFake(SentryCaptureExceptionSpy);

      let result;
      await act(async () => {
        result = renderHook(() =>
          useVirtualAgentToken({
            timeout: 1,
          }),
        );
      });

      expect(result.result.current.loadingStatus).to.equal(ERROR);
      expect(logErrorToDatadogSpy.args[0][0]).to.be.false;
      expect(logErrorToDatadogSpy.args[0][1]).to.equal(
        'vets-website - useVirtualAgentToken',
      );
      expect(logErrorToDatadogSpy.args[0][2]).to.be.an.instanceOf(Error);
      expect(SentryCaptureExceptionSpy.args[0][0]).to.be.an.instanceOf(Error);
      expect(SentryCaptureExceptionSpy.args[0][0].message).to.equal(
        'Could not retrieve virtual agent token',
      );
    });
  });
});
