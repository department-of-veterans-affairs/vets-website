import { expect } from 'chai';
import { createStringifyFormReplacer } from 'platform/forms-system/src/js/utilities/createStringifyFormReplacer';
import * as replaceEscapedCharacters from 'platform/forms-system/src/js/utilities/replaceEscapedCharacters';
import sinon from 'sinon';

describe('createStringifyFormReplacer', () => {
  const str = 'Jane said, "This is a test," and I agreed.';

  let spy;

  beforeEach(() => {
    spy = sinon.spy(replaceEscapedCharacters, 'replaceEscapedCharacters');
  });

  afterEach(() => {
    spy.restore();
  });

  context('when replaceEscapedCharacters is true', () => {
    it('calls replaceEscapedCharacters', () => {
      const replacerFn = createStringifyFormReplacer({
        replaceEscapedCharacters: true,
      });

      replacerFn('key', str);

      expect(spy.calledOnce).to.eq(true);
    });
  });

  context('when replaceEscapedCharacters is false', () => {
    it('does not call replaceEscapedCharacters', () => {
      const replacerFn = createStringifyFormReplacer({
        replaceEscapedCharacters: false,
      });

      replacerFn('key', str);

      expect(spy.calledOnce).to.eq(false);
    });
  });

  context('when value is an array', () => {
    it('removes empty objects in the array', () => {
      const replacerFn = createStringifyFormReplacer();

      const newValues = replacerFn('key', [
        {},
        { test: 'example value' },
        {},
        'this should stay',
      ]);

      expect(newValues.length).to.eq(2);
      expect(newValues[0].test).to.eq('example value');
    });
  });
});
