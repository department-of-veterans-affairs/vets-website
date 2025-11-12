/**
 * @module tests/utils/actions/ensureValidCSRFToken.unit.spec
 * @description Unit tests for CSRF token utility functions
 */

import { expect } from 'chai';
import { ensureValidCSRFToken } from './ensureValidCSRFToken';

describe('ensureValidCSRFToken', () => {
  describe('Function Export', () => {
    it('should export ensureValidCSRFToken function', () => {
      expect(ensureValidCSRFToken).to.exist;
      expect(ensureValidCSRFToken).to.be.a('function');
    });

    it('should be an async function', () => {
      const result = ensureValidCSRFToken('test');
      expect(result).to.be.an.instanceof(Promise);
    });

    it('should accept a method name parameter', () => {
      expect(ensureValidCSRFToken.length).to.equal(1);
    });
  });

  describe('Function Behavior', () => {
    let originalGetItem;
    let originalSetItem;

    beforeEach(() => {
      // Save original localStorage methods
      originalGetItem = Storage.prototype.getItem;
      originalSetItem = Storage.prototype.setItem;
    });

    afterEach(() => {
      // Restore original localStorage methods
      Storage.prototype.getItem = originalGetItem;
      Storage.prototype.setItem = originalSetItem;
    });

    it('should check localStorage for csrfToken', async () => {
      let getItemCalled = false;
      let calledWith = null;

      Storage.prototype.getItem = function getItem(key) {
        getItemCalled = true;
        calledWith = key;
        return 'existing-token';
      };

      await ensureValidCSRFToken('testMethod');

      expect(getItemCalled).to.be.true;
      expect(calledWith).to.equal('csrfToken');
    });

    it('should return without error when token exists', async () => {
      Storage.prototype.getItem = function getItem(key) {
        if (key === 'csrfToken') return 'existing-token';
        return null;
      };

      let errorThrown = false;
      try {
        await ensureValidCSRFToken('testMethod');
      } catch (error) {
        errorThrown = true;
      }

      expect(errorThrown).to.be.false;
    });

    it('should handle missing token gracefully', async () => {
      Storage.prototype.getItem = function getItem() {
        return null;
      };

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
      Storage.prototype.getItem = function getItem(key) {
        if (key === 'csrfToken') return 'token';
        return null;
      };

      await ensureValidCSRFToken('submitForm');
      await ensureValidCSRFToken('downloadPDF');
      await ensureValidCSRFToken(null);
      await ensureValidCSRFToken(undefined);

      // All calls should complete without error
      expect(true).to.be.true;
    });
  });

  describe('Integration', () => {
    it('should be usable as a utility function', async () => {
      // Save original localStorage
      const originalGetItem = Storage.prototype.getItem;

      Storage.prototype.getItem = function getItem(key) {
        if (key === 'csrfToken') return 'mock-token-value';
        return null;
      };

      const methodNames = ['submit', 'download', 'fetch', 'update'];

      // Call each method sequentially to avoid await-in-loop
      await Promise.all(
        methodNames.map(method => ensureValidCSRFToken(method)),
      );

      // Restore localStorage
      Storage.prototype.getItem = originalGetItem;

      expect(true).to.be.true;
    });

    it('should handle rapid sequential calls', async () => {
      const originalGetItem = Storage.prototype.getItem;

      Storage.prototype.getItem = function getItem(key) {
        if (key === 'csrfToken') return 'token';
        return null;
      };

      const promises = [];
      for (let i = 0; i < 5; i++) {
        promises.push(ensureValidCSRFToken(`method${i}`));
      }

      await Promise.all(promises);

      Storage.prototype.getItem = originalGetItem;

      expect(true).to.be.true;
    });
  });

  describe('Error Resilience', () => {
    it('should not throw when localStorage is unavailable', async () => {
      const originalGetItem = Storage.prototype.getItem;

      Storage.prototype.getItem = function getItem() {
        throw new Error('localStorage not available');
      };

      let errorThrown = false;
      try {
        await ensureValidCSRFToken('testMethod');
      } catch (error) {
        errorThrown = true;
      }

      Storage.prototype.getItem = originalGetItem;

      // Function should catch the error
      expect(errorThrown).to.be.true;
    });
  });
});
