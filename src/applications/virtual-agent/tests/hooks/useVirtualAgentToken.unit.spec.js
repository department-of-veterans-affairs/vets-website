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

      let result;
      await act(async () => {
        result = renderHook(() => useVirtualAgentToken({ timeout: 1 }));
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

      let result;
      await act(async () => {
        result = renderHook(() => useVirtualAgentToken({ timeout: 1 }));
      });

      expect(result.result.current.token).to.equal('abc');
      expect(result.result.current.loadingStatus).to.equal(COMPLETE);
      expect(result.result.current.apiSession).to.equal('ghi');
    });
    it('should call Sentry when an exception is thrown', async () => {
      sandbox
        .stub(
          UseWaitForCsrfTokenModule,
          UseWaitForCsrfTokenModule.useWaitForCsrfToken.name,
        )
        .returns([false, false]);
      sandbox
        .stub(ApiModule, ApiModule.apiRequest.name)
        .throws(new Error('test'));

      const SentryCaptureExceptionSpy = sandbox.spy();
      sandbox
        .stub(Sentry, 'captureException')
        .callsFake(SentryCaptureExceptionSpy);

      let result;
      await act(async () => {
        result = renderHook(() => useVirtualAgentToken({ timeout: 1 }));
      });

      expect(result.result.current.loadingStatus).to.equal(ERROR);
      expect(SentryCaptureExceptionSpy.calledOnce).to.be.true;
      expect(SentryCaptureExceptionSpy.args[0][0]).to.be.an.instanceOf(Error);
      expect(SentryCaptureExceptionSpy.args[0][0].message).to.equal(
        'Could not retrieve virtual agent token',
      );
    });
  });
});
