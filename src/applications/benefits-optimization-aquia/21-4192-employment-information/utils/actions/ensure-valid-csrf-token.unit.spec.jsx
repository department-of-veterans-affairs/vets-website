/**
 * @module tests/utils/actions/ensureValidCSRFToken.unit.spec
 * @description Unit tests for CSRF token utility functions
 */

import { expect } from 'chai';
import sinon from 'sinon';
import { ensureValidCSRFToken } from './ensure-valid-csrf-token';

describe('ensureValidCSRFToken', () => {
  let localStorageStub;
  let originalLocalStorage;

  beforeEach(() => {
    // Save original localStorage descriptor to restore later
    originalLocalStorage = Object.getOwnPropertyDescriptor(
      global,
      'localStorage',
    );

    // Stub localStorage to avoid environment differences between Node 14 and Node 22
    localStorageStub = {
      getItem: sinon.stub(),
      setItem: sinon.stub(),
      removeItem: sinon.stub(),
      clear: sinon.stub(),
    };

    // Use Object.defineProperty for Node 22 compatibility
    Object.defineProperty(global, 'localStorage', {
      value: localStorageStub,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    // Clean up stubs manually
    if (localStorageStub) {
      localStorageStub.getItem.reset();
      localStorageStub.setItem.reset();
      localStorageStub.removeItem.reset();
      localStorageStub.clear.reset();
    }

    // Restore original localStorage descriptor
    if (originalLocalStorage) {
      Object.defineProperty(global, 'localStorage', originalLocalStorage);
    } else {
      delete global.localStorage;
    }
  });

  describe('Function Export', () => {
    it('should export ensureValidCSRFToken function', () => {
      expect(ensureValidCSRFToken).to.exist;
      expect(ensureValidCSRFToken).to.be.a('function');
    });

    it('should be an async function', () => {
      localStorageStub.getItem.withArgs('csrfToken').returns('token');
      const result = ensureValidCSRFToken('test');
      expect(result).to.be.an.instanceof(Promise);
    });

    it('should accept a method name parameter', () => {
      expect(ensureValidCSRFToken.length).to.equal(1);
    });
  });

  describe('Function Behavior', () => {
    it('should check localStorage for csrfToken', async () => {
      localStorageStub.getItem.withArgs('csrfToken').returns('existing-token');

      await ensureValidCSRFToken('testMethod');

      expect(localStorageStub.getItem.calledWith('csrfToken')).to.be.true;
    });

    it('should return without error when token exists', async () => {
      localStorageStub.getItem.withArgs('csrfToken').returns('existing-token');

      let errorThrown = false;
      try {
        await ensureValidCSRFToken('testMethod');
      } catch (error) {
        errorThrown = true;
      }

      expect(errorThrown).to.be.false;
    });

    it('should handle missing token gracefully', async () => {
      localStorageStub.getItem.withArgs('csrfToken').returns(null);

      // Function should not throw even if API call fails
      let errorThrown = false;
      try {
        await ensureValidCSRFToken('testMethod');
      } catch (error) {
        errorThrown = true;
      }

      // The function catches errors internally, so no error should be thrown
      expect(errorThrown).to.be.false;
    });

    it('should handle method name parameter', async () => {
      localStorageStub.getItem.withArgs('csrfToken').returns('token');

      await ensureValidCSRFToken('submitForm');
      await ensureValidCSRFToken('downloadPDF');
      await ensureValidCSRFToken(null);
      await ensureValidCSRFToken(undefined);

      // All calls should complete without error
      expect(true).to.be.true;
    });

    it('should handle empty string as missing token', async () => {
      localStorageStub.getItem.withArgs('csrfToken').returns('');

      let errorThrown = false;
      try {
        await ensureValidCSRFToken('testMethod');
      } catch (error) {
        errorThrown = true;
      }

      expect(errorThrown).to.be.false;
    });

    it('should handle undefined as missing token', async () => {
      localStorageStub.getItem.withArgs('csrfToken').returns(undefined);

      let errorThrown = false;
      try {
        await ensureValidCSRFToken('testMethod');
      } catch (error) {
        errorThrown = true;
      }

      expect(errorThrown).to.be.false;
    });
  });

  describe('Integration', () => {
    it('should be usable as a utility function', async () => {
      localStorageStub.getItem.withArgs('csrfToken').returns('mock-token');

      const methodNames = ['submit', 'download', 'fetch', 'update'];

      // Call each method sequentially to avoid await-in-loop
      await Promise.all(
        methodNames.map(method => ensureValidCSRFToken(method)),
      );

      expect(true).to.be.true;
    });

    it('should handle rapid sequential calls', async () => {
      localStorageStub.getItem.withArgs('csrfToken').returns('token');

      const promises = [];
      for (let i = 0; i < 5; i++) {
        promises.push(ensureValidCSRFToken(`method${i}`));
      }

      await Promise.all(promises);

      expect(true).to.be.true;
    });
  });

  describe('Error Resilience', () => {
    it('should handle localStorage.getItem throwing error', async () => {
      localStorageStub.getItem
        .withArgs('csrfToken')
        .throws(new Error('localStorage not available'));

      let errorThrown = false;
      try {
        await ensureValidCSRFToken('testMethod');
      } catch (error) {
        errorThrown = true;
      }

      // The error from localStorage should propagate
      expect(errorThrown).to.be.true;
    });

    it('should handle various method name types', async () => {
      localStorageStub.getItem.withArgs('csrfToken').returns('token');

      await ensureValidCSRFToken('stringMethod');
      await ensureValidCSRFToken(null);
      await ensureValidCSRFToken(undefined);

      expect(true).to.be.true;
    });
  });
});
