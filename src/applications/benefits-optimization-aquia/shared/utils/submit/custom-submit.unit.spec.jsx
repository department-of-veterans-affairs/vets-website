/**
 * @module tests/shared/utils/submit/custom-submit.unit.spec
 * @description Unit tests for custom submit function with proactive token refresh
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
  });

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
  });

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

  describe('Form Transformation and Submission', () => {
    it('should use JSON.stringify if no transformer provided', async () => {
      infoTokenExistsStub.returns(false);

      const configWithoutTransformer = {
        submitUrl: '/v0/test',
        trackingPrefix: 'test-',
      };

      await customSubmit(mockForm, configWithoutTransformer);

      const expectedBody = JSON.stringify(mockForm.data);
      expect(
        submitToUrlStub.calledWith(
          expectedBody,
          configWithoutTransformer.submitUrl,
          configWithoutTransformer.trackingPrefix,
        ),
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
