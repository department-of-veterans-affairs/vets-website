/**
 * @module tests/shared/utils/submit/custom-submit.unit.spec
 * @description Unit tests for custom submit function with proactive token refresh.
 */

import { expect } from 'chai';
import sinon from 'sinon';

// Matches the snake_case property name from the platform token API
const ACCESS_TOKEN_EXPIRATION = 'access_token_expiration';

describe('customSubmit', () => {
  let sandbox;
  let infoTokenExistsStub;
  let getInfoTokenStub;
  let refreshStub;
  let submitToUrlStub;
  let platformTransformStub;
  let customSubmit;

  const mockFormConfig = {
    submitUrl: '/v0/test-form',
    trackingPrefix: 'test-form-',
    transformForSubmit: (config, form) => JSON.stringify(form.data),
  };

  const mockForm = {
    data: {
      field1: 'value1',
      field2: 'value2',
    },
  };

  beforeEach(async () => {
    // Create a sandbox for this test
    sandbox = sinon.createSandbox();

    // Create fresh stubs
    infoTokenExistsStub = sandbox.stub();
    getInfoTokenStub = sandbox.stub();
    refreshStub = sandbox.stub().resolves();
    submitToUrlStub = sandbox.stub().resolves({ success: true });
    platformTransformStub = sandbox.stub().returns('{"transformed":"data"}');

    // Set default service name in sessionStorage
    sessionStorage.setItem('serviceName', 'idme');

    // Import the module
    const module = await import('./custom-submit');
    customSubmit = module.customSubmit;

    // Mock the platform utilities
    const platformUtils = await import('platform/utilities/oauth/utilities');
    sandbox
      .stub(platformUtils, 'infoTokenExists')
      .callsFake(infoTokenExistsStub);
    sandbox.stub(platformUtils, 'getInfoToken').callsFake(getInfoTokenStub);
    sandbox.stub(platformUtils, 'refresh').callsFake(refreshStub);

    const platformHelpers = await import('platform/forms-system/src/js/helpers');
    sandbox
      .stub(platformHelpers, 'transformForSubmit')
      .callsFake(platformTransformStub);

    const platformActions = await import('platform/forms-system/src/js/actions');
    sandbox.stub(platformActions, 'submitToUrl').callsFake(submitToUrlStub);
  });

  afterEach(() => {
    // Restore all stubs created in the sandbox
    sandbox.restore();
    sessionStorage.removeItem('serviceName');
  });

  describe('Basic Functionality', () => {
    it('should export a function', async () => {
      const module = await import('./custom-submit');
      expect(module.customSubmit).to.be.a('function');
    });

    it('should return a promise', async () => {
      infoTokenExistsStub.returns(false);

      const result = customSubmit(mockForm, mockFormConfig);
      expect(result).to.be.instanceOf(Promise);
    });
  });

  describe('Token Refresh Decision Logic', () => {
    // Some auth providers return Date objects for token expiration.
    // The normalization layer must handle this format correctly, or the
    // comparison with epoch seconds would produce NaN and silently skip refresh.
    it('should refresh when expiration is a Date object within buffer', async () => {
      const expirationTime = new Date(Date.now() + 60 * 1000);

      infoTokenExistsStub.returns(true);
      getInfoTokenStub.returns({
        [ACCESS_TOKEN_EXPIRATION]: expirationTime,
      });

      await customSubmit(mockForm, mockFormConfig);

      expect(refreshStub.calledOnce).to.be.true;
    });

    // Verifies the happy path: a token with plenty of time left should NOT
    // trigger a refresh. Unnecessary refreshes add latency to every submission.
    it('should skip refresh when token is fresh (180 seconds)', async () => {
      const currentTime = Math.floor(Date.now() / 1000);
      const expirationTime = currentTime + 180; // 3 minutes

      infoTokenExistsStub.returns(true);
      getInfoTokenStub.returns({
        [ACCESS_TOKEN_EXPIRATION]: expirationTime,
      });

      await customSubmit(mockForm, mockFormConfig);

      expect(refreshStub.called).to.be.false;
    });

    // Boundary condition: exactly at the buffer (120s) means the token won't
    // expire during submission, so refreshing is unnecessary. The comparison
    // uses strict less-than (<), not less-than-or-equal (<=).
    it('should skip refresh at exactly 120 second boundary', async () => {
      const currentTime = Math.floor(Date.now() / 1000);
      const expirationTime = currentTime + 120; // Exactly 2 minutes

      infoTokenExistsStub.returns(true);
      getInfoTokenStub.returns({
        [ACCESS_TOKEN_EXPIRATION]: expirationTime,
      });

      await customSubmit(mockForm, mockFormConfig);

      expect(refreshStub.called).to.be.false;
    });

    // Edge case: the token is already expired. This is the worst-case scenario
    // for monitoring noise, without the proactive refresh, the submission goes
    // out with a dead token, triggers a 403 that gets logged, and then the
    // platform retries successfully. The 403 is a false positive.
    it('should refresh token when already expired (negative time)', async () => {
      const currentTime = Math.floor(Date.now() / 1000);
      const expirationTime = currentTime - 30; // Expired 30 seconds ago

      infoTokenExistsStub.returns(true);
      getInfoTokenStub.returns({
        [ACCESS_TOKEN_EXPIRATION]: expirationTime,
      });

      await customSubmit(mockForm, mockFormConfig);

      expect(refreshStub.calledOnce).to.be.true;
    });

    it('should refresh token when it expires in less than 2 minutes (90 seconds in this case)', async () => {
      const currentTime = Math.floor(Date.now() / 1000);
      const expirationTime = currentTime + 90; // 1.5 minutes

      infoTokenExistsStub.returns(true);
      getInfoTokenStub.returns({
        [ACCESS_TOKEN_EXPIRATION]: expirationTime,
      });

      await customSubmit(mockForm, mockFormConfig);

      expect(refreshStub.calledOnce).to.be.true;
    });

    // Boundary condition: 119s is one second below the 120s buffer threshold.
    // Confirms the strict less-than comparison triggers refresh at (buffer - 1).
    it('should refresh at 119 seconds (just under boundary)', async () => {
      const currentTime = Math.floor(Date.now() / 1000);
      const expirationTime = currentTime + 119;

      infoTokenExistsStub.returns(true);
      getInfoTokenStub.returns({
        [ACCESS_TOKEN_EXPIRATION]: expirationTime,
      });

      await customSubmit(mockForm, mockFormConfig);

      expect(refreshStub.calledOnce).to.be.true;
    });

    // Auth providers return expiration in different formats. Some (e.g., ID.me)
    // return millisecond epochs. Without normalization, the raw millisecond
    // value (≈1.7 trillion) minus the current seconds epoch (≈1.7 billion)
    // would always look "fresh," so the refresh would never trigger  and
    // every submission with a stale token would produce a false-positive 403
    // in the monitoring platform.
    it('should refresh when expiration is a millisecond epoch within buffer', async () => {
      const expirationMs = Date.now() + 60 * 1000; // 60 seconds from now, in ms

      infoTokenExistsStub.returns(true);
      getInfoTokenStub.returns({
        [ACCESS_TOKEN_EXPIRATION]: expirationMs,
      });

      await customSubmit(mockForm, mockFormConfig);

      expect(refreshStub.calledOnce).to.be.true;
    });

    // Some providers (e.g., Login.gov) return ISO 8601 date strings for
    // expiration instead of numeric timestamps. Without normalization,
    // subtracting a string from a number produces NaN, causing the refresh
    // comparison to silently fail, meaning stale tokens would never get
    // refreshed and every expiry would produce a 403 in monitoring.
    it('should refresh when expiration is an ISO date string within buffer', async () => {
      const futureDate = new Date(Date.now() + 60 * 1000);
      const isoString = futureDate.toISOString(); // e.g. '2026-02-24T12:01:00.000Z'

      infoTokenExistsStub.returns(true);
      getInfoTokenStub.returns({
        [ACCESS_TOKEN_EXPIRATION]: isoString,
      });

      await customSubmit(mockForm, mockFormConfig);

      expect(refreshStub.calledOnce).to.be.true;
    });
  });

  // These tests ensure submission always proceeds even when authentication
  // state is incomplete. The proactive refresh is a monitoring optimization,
  // not a submission requirement, unauthenticated or partially-authenticated
  // submissions must still go through. The platform handles auth independently.
  describe('No Token Scenarios', () => {
    it('should skip refresh when no auth token exists', async () => {
      infoTokenExistsStub.returns(false);

      await customSubmit(mockForm, mockFormConfig);

      expect(refreshStub.called).to.be.false;
      expect(submitToUrlStub.calledOnce).to.be.true;
    });

    it('should skip refresh when getInfoToken returns null', async () => {
      infoTokenExistsStub.returns(true);
      getInfoTokenStub.returns(null);

      await customSubmit(mockForm, mockFormConfig);

      expect(refreshStub.called).to.be.false;
      expect(submitToUrlStub.calledOnce).to.be.true;
    });

    it('should skip refresh when token has no expiration field', async () => {
      infoTokenExistsStub.returns(true);
      getInfoTokenStub.returns({
        someOtherField: 'value',
      });

      await customSubmit(mockForm, mockFormConfig);

      expect(refreshStub.called).to.be.false;
      expect(submitToUrlStub.calledOnce).to.be.true;
    });

    // If the expiration value is present but not a recognizable format
    // (e.g., a boolean or garbage string), normalization returns null.
    // The function should treat this the same as a missing expiration —
    // skip the refresh but still submit. Submitting is critical; we never
    // want an unparseable expiration to block form submission.
    it('should skip refresh and still submit when expiration is unparseable', async () => {
      infoTokenExistsStub.returns(true);
      getInfoTokenStub.returns({
        [ACCESS_TOKEN_EXPIRATION]: 'not-a-valid-date',
      });

      await customSubmit(mockForm, mockFormConfig);

      expect(refreshStub.called).to.be.false;
      expect(submitToUrlStub.calledOnce).to.be.true;
    });
  });

  // The proactive refresh is wrapped in a try/catch because it's purely a
  // monitoring optimization, if it fails, submission must still proceed.
  // The platform's 403 retry handles the actual auth recovery. These tests
  // verify the catch block never blocks submission.
  describe('Error Handling', () => {
    it('should proceed with submission if token refresh fails', async () => {
      const currentTime = Math.floor(Date.now() / 1000);
      const expirationTime = currentTime + 60;

      infoTokenExistsStub.returns(true);
      getInfoTokenStub.returns({
        [ACCESS_TOKEN_EXPIRATION]: expirationTime,
      });

      const refreshError = new Error('Network error during refresh');
      refreshStub.rejects(refreshError);

      const result = await customSubmit(mockForm, mockFormConfig);

      expect(submitToUrlStub.calledOnce).to.be.true;
      expect(result).to.deep.equal({ success: true });
    });

    it('should not throw error when refresh fails', async () => {
      const currentTime = Math.floor(Date.now() / 1000);
      const expirationTime = currentTime + 60;

      infoTokenExistsStub.returns(true);
      getInfoTokenStub.returns({
        [ACCESS_TOKEN_EXPIRATION]: expirationTime,
      });

      refreshStub.rejects(new Error('Refresh failed'));

      let didThrow = false;
      try {
        await customSubmit(mockForm, mockFormConfig);
      } catch (error) {
        didThrow = true;
      }

      expect(didThrow).to.be.false;
    });
  });

  // The custom submit supports both form-specific transformers (used by most
  // BIO forms) and the platform's generic transformer as a fallback. This
  // ensures forms work correctly whether or not they define transformForSubmit.
  describe('Form Transformation and Submission', () => {
    it('should use platform transformForSubmit if no custom transformer provided', async () => {
      infoTokenExistsStub.returns(false);

      const configWithoutTransformer = {
        submitUrl: '/v0/test',
        trackingPrefix: 'test-',
      };

      await customSubmit(mockForm, configWithoutTransformer);

      expect(platformTransformStub.calledOnce).to.be.true;
      expect(
        platformTransformStub.calledWith(configWithoutTransformer, mockForm),
      ).to.be.true;
    });

    it('should call submitToUrl with correct parameters', async () => {
      infoTokenExistsStub.returns(false);

      await customSubmit(mockForm, mockFormConfig);

      const expectedBody = JSON.stringify(mockForm.data);
      expect(submitToUrlStub.calledOnce).to.be.true;
      expect(
        submitToUrlStub.calledWith(
          expectedBody,
          mockFormConfig.submitUrl,
          mockFormConfig.trackingPrefix,
        ),
      ).to.be.true;
    });

    it('should return the promise from submitToUrl', async () => {
      infoTokenExistsStub.returns(false);

      const expectedResult = { success: true, confirmationNumber: '12345' };
      submitToUrlStub.resolves(expectedResult);

      const result = await customSubmit(mockForm, mockFormConfig);

      expect(result).to.deep.equal(expectedResult);
    });
  });

  // The refresh() call requires a service type (idme, logingov, etc.) to know
  // which auth provider to use. This value comes from sessionStorage, set at
  // login time. These tests verify the service name is passed through correctly.
  describe('Service Name Handling', () => {
    it('should use service name from sessionStorage for refresh', async () => {
      const currentTime = Math.floor(Date.now() / 1000);
      const expirationTime = currentTime + 60;

      infoTokenExistsStub.returns(true);
      getInfoTokenStub.returns({
        [ACCESS_TOKEN_EXPIRATION]: expirationTime,
      });

      sessionStorage.setItem('serviceName', 'logingov');

      await customSubmit(mockForm, mockFormConfig);

      expect(refreshStub.calledOnce).to.be.true;
      expect(refreshStub.firstCall.args[0]).to.deep.equal({ type: 'logingov' });
    });

    it('should handle different service types', async () => {
      const currentTime = Math.floor(Date.now() / 1000);
      const expirationTime = currentTime + 60;

      infoTokenExistsStub.returns(true);
      getInfoTokenStub.returns({
        [ACCESS_TOKEN_EXPIRATION]: expirationTime,
      });

      sessionStorage.setItem('serviceName', 'idme');

      await customSubmit(mockForm, mockFormConfig);

      expect(refreshStub.calledOnce).to.be.true;
      expect(refreshStub.firstCall.args[0]).to.deep.equal({ type: 'idme' });
    });

    // The refresh decision is gated only on token expiration, not on
    // serviceName. If serviceName is missing from sessionStorage, refresh()
    // should still be called so the failure is logged and visible in
    // production — silently skipping the entire refresh block would make
    // a missing serviceName impossible to diagnose from logs alone.
    it('should still attempt refresh when serviceName is missing from sessionStorage', async () => {
      const currentTime = Math.floor(Date.now() / 1000);
      const expirationTime = currentTime + 60;

      infoTokenExistsStub.returns(true);
      getInfoTokenStub.returns({
        [ACCESS_TOKEN_EXPIRATION]: expirationTime,
      });

      sessionStorage.removeItem('serviceName');

      await customSubmit(mockForm, mockFormConfig);

      // Should still attempt the refresh so the platform logs the failure
      expect(refreshStub.calledOnce).to.be.true;
      expect(refreshStub.firstCall.args[0]).to.deep.equal({ type: null });

      // Submission should proceed regardless
      expect(submitToUrlStub.calledOnce).to.be.true;
    });
  });

  describe('Integration Scenarios', () => {
    it('should complete full flow: fresh token, no refresh, submit', async () => {
      const currentTime = Math.floor(Date.now() / 1000);

      infoTokenExistsStub.returns(true);
      getInfoTokenStub.returns({
        [ACCESS_TOKEN_EXPIRATION]: currentTime + 200,
      });

      const result = await customSubmit(mockForm, mockFormConfig);

      // Should skip refresh
      expect(refreshStub.called).to.be.false;

      // Should submit
      expect(submitToUrlStub.calledOnce).to.be.true;
      expect(result).to.deep.equal({ success: true });
    });

    it('should complete full flow: expiring token, refresh, submit', async () => {
      const currentTime = Math.floor(Date.now() / 1000);

      infoTokenExistsStub.returns(true);
      getInfoTokenStub.returns({
        [ACCESS_TOKEN_EXPIRATION]: currentTime + 60,
      });

      const result = await customSubmit(mockForm, mockFormConfig);

      // Should refresh
      expect(refreshStub.calledOnce).to.be.true;

      // Should submit
      expect(submitToUrlStub.calledOnce).to.be.true;
      expect(result).to.deep.equal({ success: true });
    });

    it('should complete full flow: no token, skip refresh, submit', async () => {
      infoTokenExistsStub.returns(false);

      const result = await customSubmit(mockForm, mockFormConfig);

      // Should skip refresh
      expect(refreshStub.called).to.be.false;

      // Should submit
      expect(submitToUrlStub.calledOnce).to.be.true;
      expect(result).to.deep.equal({ success: true });
    });

    it('should complete full flow: refresh fails, still submits', async () => {
      const currentTime = Math.floor(Date.now() / 1000);

      infoTokenExistsStub.returns(true);
      getInfoTokenStub.returns({
        [ACCESS_TOKEN_EXPIRATION]: currentTime + 60,
      });

      refreshStub.rejects(new Error('Refresh error'));

      const result = await customSubmit(mockForm, mockFormConfig);

      // Should attempt refresh
      expect(refreshStub.calledOnce).to.be.true;

      // Should still submit
      expect(submitToUrlStub.calledOnce).to.be.true;
      expect(result).to.deep.equal({ success: true });
    });
  });
});
