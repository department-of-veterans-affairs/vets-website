const { expect } = require('chai');
const sinon = require('sinon');

const { shouldAddArrayItem, checkWebComponent } = require('./webComponents');

// Minimal mock page builder for unit tests that call page.locator / page.evaluate
function createMockPage(overrides = {}) {
  return {
    locator: sinon.stub(),
    evaluate: sinon.stub(),
    ...overrides,
  };
}

// Builds a chainable locator mock
function createMockLocator(overrides = {}) {
  return {
    first: sinon.stub().returnsThis(),
    getAttribute: sinon.stub().resolves(null),
    count: sinon.stub().resolves(0),
    ...overrides,
  };
}

describe('Playwright webComponents helpers (unit)', () => {
  describe('shouldAddArrayItem', () => {
    it('returns override value directly when boolean', async () => {
      const page = createMockPage();
      expect(await shouldAddArrayItem(page, '.sel', true, {})).to.be.true;
      expect(await shouldAddArrayItem(page, '.sel', false, {})).to.be.false;
    });

    it('compares test data array length to card count', async () => {
      const locator = createMockLocator({
        getAttribute: sinon.stub().resolves('items'),
        count: sinon.stub().resolves(1),
      });

      const page = createMockPage({
        locator: sinon.stub(),
      });

      // First call for selector → returns element with data-array-path
      page.locator.withArgs('.sel').returns(locator);
      // Second call for va-card count
      page.locator.withArgs('va-card').returns({
        count: sinon.stub().resolves(1),
      });

      const testData = { items: [{ a: 1 }, { b: 2 }, { c: 3 }] };
      const result = await shouldAddArrayItem(
        page,
        '.sel',
        undefined,
        testData,
      );
      // 3 items in data, 1 card on page → should add
      expect(result).to.be.true;
    });

    it('returns false when cards match data length', async () => {
      const locator = createMockLocator({
        getAttribute: sinon.stub().resolves('items'),
        count: sinon.stub().resolves(2),
      });

      const page = createMockPage({
        locator: sinon.stub(),
      });
      page.locator.withArgs('.sel').returns(locator);
      page.locator.withArgs('va-card').returns({
        count: sinon.stub().resolves(2),
      });

      const testData = { items: [{ a: 1 }, { b: 2 }] };
      const result = await shouldAddArrayItem(
        page,
        '.sel',
        undefined,
        testData,
      );
      expect(result).to.be.false;
    });

    it('handles nested array paths (e.g. "dependents.children")', async () => {
      // This test verifies the bug: testData[arrayPath] won't work for
      // dotted paths like "dependents.children".
      // lodash.get would resolve "dependents.children" to [1, 2, 3].
      const locator = createMockLocator({
        getAttribute: sinon.stub().resolves('dependents.children'),
        count: sinon.stub().resolves(0),
      });

      const page = createMockPage({
        locator: sinon.stub(),
      });
      page.locator.withArgs('.sel').returns(locator);
      page.locator.withArgs('va-card').returns({
        count: sinon.stub().resolves(0),
      });

      const testData = {
        dependents: { children: [{ name: 'A' }, { name: 'B' }] },
      };

      const result = await shouldAddArrayItem(
        page,
        '.sel',
        undefined,
        testData,
      );
      // With the bug (testData["dependents.children"] === undefined),
      // this returns false. After fix (lodash get), should return true.
      // This test documents the EXPECTED correct behavior:
      expect(result).to.be.true;
    });

    it('returns false when arrayPath is not found', async () => {
      const locator = createMockLocator({
        getAttribute: sinon.stub().resolves(null),
        count: sinon.stub().resolves(0),
      });

      const page = createMockPage({
        locator: sinon.stub(),
      });
      page.locator.withArgs('.sel').returns(locator);

      const result = await shouldAddArrayItem(page, '.sel', undefined, {});
      expect(result).to.be.false;
    });
  });

  describe('checkWebComponent', () => {
    it('calls page.evaluate with web component selectors', async () => {
      const page = createMockPage({
        evaluate: sinon.stub().resolves(true),
      });

      const result = await checkWebComponent(page);
      expect(result).to.be.true;
      expect(page.evaluate.calledOnce).to.be.true;

      // Verify the callback is a function
      const evaluateFn = page.evaluate.firstCall.args[0];
      expect(evaluateFn).to.be.a('function');
    });

    it('returns boolean result from page.evaluate', async () => {
      const page = createMockPage({
        evaluate: sinon.stub().resolves(false),
      });

      const result = await checkWebComponent(page);
      expect(result).to.be.false;
    });
  });
});
