const { expect } = require('chai');
const sinon = require('sinon');

const {
  extractBaseNameFromFirstField,
  markPatternFieldsAsProcessed,
  PATTERN_CLASS_TO_FILL_ACTION,
} = require('./patterns');

function createMockLocator(overrides = {}) {
  const loc = {
    first: sinon.stub().returnsThis(),
    count: sinon.stub().resolves(0),
    getAttribute: sinon.stub().resolves(null),
    nth: sinon.stub().returnsThis(),
    locator: sinon.stub(),
    ...overrides,
  };
  if (!overrides.locator) {
    loc.locator = sinon.stub().returns(loc);
  }
  return loc;
}

describe('Playwright form-tester/patterns.js (unit)', () => {
  describe('extractBaseNameFromFirstField', () => {
    it('extracts base name from first field name attribute', async () => {
      const firstField = createMockLocator({
        getAttribute: sinon
          .stub()
          .onFirstCall()
          .resolves('root_address_street')
          .onSecondCall()
          .resolves(null),
      });
      const patternFields = createMockLocator({
        count: sinon.stub().resolves(1),
        first: sinon.stub().returns(firstField),
      });
      const patternLocator = createMockLocator({
        locator: sinon.stub().returns(patternFields),
      });

      const result = await extractBaseNameFromFirstField(patternLocator);
      expect(result).to.equal('root_address');
    });

    it('returns null when no pattern fields found', async () => {
      const patternFields = createMockLocator({
        count: sinon.stub().resolves(0),
      });
      const patternLocator = createMockLocator({
        locator: sinon.stub().returns(patternFields),
      });

      const result = await extractBaseNameFromFirstField(patternLocator);
      expect(result).to.be.null;
    });

    it('falls back to id attribute when name is missing', async () => {
      const firstField = createMockLocator({
        getAttribute: sinon
          .stub()
          .onFirstCall()
          .resolves(null)
          .onSecondCall()
          .resolves('root_mailingAddress_city'),
      });
      const patternFields = createMockLocator({
        count: sinon.stub().resolves(1),
        first: sinon.stub().returns(firstField),
      });
      const patternLocator = createMockLocator({
        locator: sinon.stub().returns(patternFields),
      });

      const result = await extractBaseNameFromFirstField(patternLocator);
      expect(result).to.equal('root_mailingAddress');
    });

    it('returns null when field has no name or id', async () => {
      const firstField = createMockLocator({
        getAttribute: sinon.stub().resolves(null),
      });
      const patternFields = createMockLocator({
        count: sinon.stub().resolves(1),
        first: sinon.stub().returns(firstField),
      });
      const patternLocator = createMockLocator({
        locator: sinon.stub().returns(patternFields),
      });

      const result = await extractBaseNameFromFirstField(patternLocator);
      expect(result).to.be.null;
    });
  });

  describe('markPatternFieldsAsProcessed', () => {
    it('adds field keys from name attributes to touchedFields', async () => {
      const field1 = createMockLocator({
        getAttribute: sinon
          .stub()
          .onFirstCall()
          .resolves('root_address_street')
          .onSecondCall()
          .resolves(null),
      });
      const field2 = createMockLocator({
        getAttribute: sinon
          .stub()
          .onFirstCall()
          .resolves('root_address_city')
          .onSecondCall()
          .resolves(null),
      });

      const patternFields = createMockLocator({
        count: sinon.stub().resolves(2),
        nth: sinon.stub().callsFake(i => (i === 0 ? field1 : field2)),
      });

      const patternLocator = createMockLocator({
        locator: sinon.stub().returns(patternFields),
        getAttribute: sinon.stub().resolves('root_address'),
      });

      const touchedFields = new Set();
      await markPatternFieldsAsProcessed(patternLocator, touchedFields);

      expect(touchedFields.has('root_address_street')).to.be.true;
      expect(touchedFields.has('root_address_city')).to.be.true;
      expect(touchedFields.has('root_address')).to.be.true;
    });

    it('handles fields with no name or id gracefully', async () => {
      const field = createMockLocator({
        getAttribute: sinon.stub().resolves(null),
      });
      const patternFields = createMockLocator({
        count: sinon.stub().resolves(1),
        nth: sinon.stub().returns(field),
      });
      const patternLocator = createMockLocator({
        locator: sinon.stub().returns(patternFields),
        getAttribute: sinon.stub().resolves(null),
      });

      const touchedFields = new Set();
      await markPatternFieldsAsProcessed(patternLocator, touchedFields);

      expect(touchedFields.size).to.equal(0);
    });
  });

  describe('PATTERN_CLASS_TO_FILL_ACTION', () => {
    it('maps address class to a handler function', () => {
      expect(PATTERN_CLASS_TO_FILL_ACTION).to.have.property(
        'vads-web-component-pattern-address',
      );
      expect(
        PATTERN_CLASS_TO_FILL_ACTION['vads-web-component-pattern-address'],
      ).to.be.a('function');
    });

    it('maps array builder class to a handler function', () => {
      expect(PATTERN_CLASS_TO_FILL_ACTION).to.have.property(
        'wc-pattern-array-builder',
      );
      expect(PATTERN_CLASS_TO_FILL_ACTION['wc-pattern-array-builder']).to.be.a(
        'function',
      );
    });
  });
});
