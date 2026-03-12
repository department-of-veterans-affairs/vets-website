/**
 * Shared behavioral contracts for form-tester utility functions.
 *
 * These test cases verify identical behavior between the Cypress and
 * Playwright implementations of createArrayPageObjects, createTestConfig,
 * and inProgressMock.
 *
 * Usage:
 *   const { runContracts } = require('./form-tester-utilities.contracts');
 *   runContracts({ createArrayPageObjects, createTestConfig, inProgressMock });
 */

const { expect } = require('chai');
const sinon = require('sinon');

function runContracts({
  createArrayPageObjects,
  createTestConfig,
  inProgressMock,
}) {
  describe('createArrayPageObjects (shared contract)', () => {
    it('returns empty array when no chapters exist', () => {
      expect(createArrayPageObjects({})).to.deep.equal([]);
    });

    it('returns empty array when chapters have no array pages', () => {
      const formConfig = {
        chapters: {
          ch1: {
            pages: {
              page1: { title: 'Not array' },
            },
          },
        },
      };
      expect(createArrayPageObjects(formConfig)).to.deep.equal([]);
    });

    it('extracts single array page with correct arrayPath', () => {
      const formConfig = {
        chapters: {
          ch1: {
            pages: {
              page1: { arrayPath: 'dependents', path: '/dependents/:index' },
            },
          },
        },
      };

      const result = createArrayPageObjects(formConfig);
      expect(result).to.have.lengthOf(1);
      expect(result[0].arrayPath).to.equal('dependents');
    });

    it('produces regex that matches numeric indices', () => {
      const formConfig = {
        chapters: {
          ch1: {
            pages: {
              p1: { arrayPath: 'items', path: '/items/:index' },
            },
          },
        },
      };

      const result = createArrayPageObjects(formConfig);
      expect(result[0].regex.test('/items/0')).to.be.true;
      expect(result[0].regex.test('/items/42')).to.be.true;
      expect(result[0].regex.test('/items/abc')).to.be.false;
    });

    it('regex captures the index as group 1', () => {
      const formConfig = {
        chapters: {
          ch1: {
            pages: {
              p1: {
                arrayPath: 'items',
                path: '/items/:index/details',
              },
            },
          },
        },
      };

      const result = createArrayPageObjects(formConfig);
      const match = '/items/7/details'.match(result[0].regex);
      expect(match).to.not.be.null;
      expect(match[1]).to.equal('7');
    });

    it('handles multiple array pages across multiple chapters', () => {
      const formConfig = {
        chapters: {
          ch1: {
            pages: {
              p1: { arrayPath: 'employers', path: '/employers/:index' },
            },
          },
          ch2: {
            pages: {
              p2: { arrayPath: 'children', path: '/children/:index' },
              p3: { title: 'Non-array page' },
            },
          },
        },
      };

      const result = createArrayPageObjects(formConfig);
      expect(result).to.have.lengthOf(2);
      expect(result.map(r => r.arrayPath)).to.deep.equal([
        'employers',
        'children',
      ]);
    });

    it('skips pages without arrayPath', () => {
      const formConfig = {
        chapters: {
          ch1: {
            pages: {
              p1: { title: 'Intro' },
              p2: { arrayPath: 'items', path: '/items/:index' },
              p3: { title: 'Review' },
            },
          },
        },
      };

      const result = createArrayPageObjects(formConfig);
      expect(result).to.have.lengthOf(1);
      expect(result[0].arrayPath).to.equal('items');
    });
  });

  describe('createTestConfig (shared contract)', () => {
    it('returns appName and rootUrl from manifest', () => {
      const result = createTestConfig(
        {},
        { appName: 'MyApp', rootUrl: '/my-app' },
      );
      expect(result.appName).to.equal('MyApp');
      expect(result.rootUrl).to.equal('/my-app');
    });

    it('includes arrayPages from formConfig', () => {
      const formConfig = {
        chapters: {
          ch: {
            pages: {
              p: { arrayPath: 'items', path: '/items/:index' },
            },
          },
        },
      };
      const result = createTestConfig({}, {}, formConfig);
      expect(result.arrayPages).to.have.lengthOf(1);
      expect(result.arrayPages[0].arrayPath).to.equal('items');
    });

    it('user config properties override defaults', () => {
      const result = createTestConfig(
        { appName: 'Override', extra: true },
        { appName: 'Original', rootUrl: '/test' },
      );
      expect(result.appName).to.equal('Override');
      expect(result.extra).to.be.true;
      expect(result.rootUrl).to.equal('/test');
    });

    it('handles empty manifest and formConfig', () => {
      const result = createTestConfig({ custom: 'value' });
      expect(result.appName).to.be.undefined;
      expect(result.rootUrl).to.be.undefined;
      expect(result.arrayPages).to.deep.equal([]);
      expect(result.custom).to.equal('value');
    });
  });

  describe('inProgressMock (shared contract)', () => {
    let clock;

    beforeEach(() => {
      clock = sinon.useFakeTimers({
        now: new Date('2025-06-15T12:00:00Z'),
        toFake: ['Date'],
      });
    });

    afterEach(() => {
      clock.restore();
    });

    it('returns formData from prefill', () => {
      const result = inProgressMock({ prefill: { ssn: '123' } });
      expect(result.formData).to.deep.equal({ ssn: '123' });
    });

    it('defaults to empty formData when no prefill', () => {
      const result = inProgressMock();
      expect(result.formData).to.deep.equal({});
    });

    it('sets metadata.returnUrl', () => {
      const result = inProgressMock({ returnUrl: '/page-3' });
      expect(result.metadata.returnUrl).to.equal('/page-3');
    });

    it('sets metadata.version', () => {
      const result = inProgressMock({ version: 5 });
      expect(result.metadata.version).to.equal(5);
    });

    it('always sets inProgressFormId to 460', () => {
      const result = inProgressMock();
      expect(result.metadata.inProgressFormId).to.equal(460);
    });

    it('sets submission defaults to false/null', () => {
      const result = inProgressMock();
      expect(result.metadata.submission).to.deep.equal({
        status: false,
        errorMessage: false,
        id: false,
        timestamp: null,
        hasAttemptedSubmit: false,
      });
    });

    it('sets savedAt and lastUpdated to current time', () => {
      const now = Date.now();
      const result = inProgressMock();
      expect(result.metadata.savedAt).to.equal(now);
      expect(result.metadata.lastUpdated).to.equal(now);
      expect(result.metadata.createdAt).to.equal(now);
    });

    it('sets expiresAt to 30 days from now as unix timestamp', () => {
      const result = inProgressMock();
      const now = new Date('2025-06-15T12:00:00Z');
      const thirtyDaysLater = new Date(
        now.getTime() + 30 * 24 * 60 * 60 * 1000,
      );
      const expectedUnix = Math.floor(thirtyDaysLater.getTime() / 1000);
      expect(result.metadata.expiresAt).to.equal(expectedUnix);
    });
  });
}

module.exports = { runContracts };
