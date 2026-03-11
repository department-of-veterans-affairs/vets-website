const { expect } = require('chai');
const sinon = require('sinon');

const { findData, enterFieldData, clickFormContinue } = require('./index');

function createMockLocator(overrides = {}) {
  const loc = {
    first: sinon.stub().returnsThis(),
    count: sinon.stub().resolves(0),
    click: sinon.stub().resolves(),
    fill: sinon.stub().resolves(),
    clear: sinon.stub().resolves(),
    selectOption: sinon.stub().resolves(),
    evaluate: sinon.stub().resolves(),
    getAttribute: sinon.stub().resolves(null),
    locator: sinon.stub(),
    ...overrides,
  };
  if (!overrides.locator) {
    loc.locator = sinon.stub().returns(loc);
  }
  return loc;
}

// Creates a mock Playwright page for unit testing.
function createMockPage() {
  const loc = createMockLocator();
  return {
    locator: sinon.stub().returns(loc),
    evaluate: sinon.stub().resolves(),
  };
}

describe('Playwright form-tester/index.js (unit)', () => {
  describe('findData', () => {
    it('looks up flat field key from test data', () => {
      const testData = { veteranName: 'Jane' };
      const result = findData('root_veteranName', '', testData);
      expect(result).to.equal('Jane');
    });

    it('looks up nested field key from test data', () => {
      const testData = { veteran: { fullName: { first: 'Jane' } } };
      const result = findData('root_veteran_fullName_first', '', testData);
      expect(result).to.equal('Jane');
    });

    it('resolves array item path prefix', () => {
      const testData = {
        employers: [{ name: 'USDS' }, { name: 'VA' }],
      };
      const result = findData('root_name', 'employers[1]', testData);
      expect(result).to.equal('VA');
    });

    it('returns undefined for missing key', () => {
      const testData = { a: 1 };
      const result = findData('root_missing', '', testData);
      expect(result).to.be.undefined;
    });

    it('returns undefined for missing nested path', () => {
      const testData = { veteran: {} };
      const result = findData('root_veteran_phone', '', testData);
      expect(result).to.be.undefined;
    });
  });

  describe('enterFieldData', () => {
    it('dispatches to enterData for standard fields', async () => {
      const innerLoc = createMockLocator({ count: sinon.stub().resolves(1) });
      const page = createMockPage();
      page.locator = sinon.stub().returns(innerLoc);

      // Regular text input — enterData will call fill on the locator
      await enterFieldData(page, {
        key: 'testField',
        type: 'text',
        data: 'hello',
        tagName: 'INPUT',
      });

      // Should have located the field and filled it
      expect(page.locator.called).to.be.true;
    });

    it('dispatches to web component handler for VA- tags', async () => {
      const innerLoc = createMockLocator({ count: sinon.stub().resolves(1) });
      const page = createMockPage();
      page.locator = sinon.stub().returns(innerLoc);

      await enterFieldData(page, {
        key: 'firstName',
        type: 'text',
        data: 'Alice',
        tagName: 'VA-TEXT-INPUT',
      });

      expect(page.locator.called).to.be.true;
    });
  });

  describe('clickFormContinue', () => {
    it('clicks va-button-pair primary button when present', async () => {
      const primaryBtn = createMockLocator({
        count: sinon.stub().resolves(1),
      });
      const vaButtonPair = createMockLocator({
        count: sinon.stub().resolves(1),
      });
      vaButtonPair.locator = sinon.stub().returns(primaryBtn);

      const mainLoc = createMockLocator({
        count: sinon.stub().resolves(1),
      });
      mainLoc.locator = sinon.stub().callsFake(sel => {
        if (sel === 'va-button-pair') return vaButtonPair;
        return createMockLocator();
      });

      const page = {
        locator: sinon.stub().callsFake(sel => {
          if (sel === 'main') return mainLoc;
          return createMockLocator();
        }),
      };

      await clickFormContinue(page);

      expect(primaryBtn.click.calledOnce).to.be.true;
    });

    it('falls back to standard continue button', async () => {
      const continueBtn = createMockLocator({
        count: sinon.stub().resolves(1),
      });
      const emptyPair = createMockLocator({ count: sinon.stub().resolves(0) });

      const mainLoc = createMockLocator();
      mainLoc.locator = sinon.stub().callsFake(sel => {
        if (sel === 'va-button-pair') return emptyPair;
        if (
          sel.includes('usa-button-primary') ||
          sel.includes('type="submit"')
        ) {
          return continueBtn;
        }
        return createMockLocator();
      });

      const page = {
        locator: sinon.stub().returns(mainLoc),
      };

      await clickFormContinue(page);

      expect(continueBtn.click.calledOnce).to.be.true;
    });
  });
});
