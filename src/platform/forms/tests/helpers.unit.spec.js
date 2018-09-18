import { expect } from 'chai';
import sinon from 'sinon';

import {
  isActivePage,
} from '../helpers';

describe('Helpers unit tests', () => {
  describe('isActivePage', () => {
    test('matches against data', () => {
      const page = {
        depends: { testData: 'Y' }
      };
      const data = {
        testData: 'Y'
      };

      const result = isActivePage(page, data);

      expect(result).to.be.true;
    });
    test('false with mismatched data', () => {
      const page = {
        depends: { testData: 'Y' }
      };
      const data = {
        testData: 'N'
      };

      const result = isActivePage(page, data);

      expect(result).to.be.false;
    });
    test('matches using function', () => {
      const matcher = sinon.stub().returns(true);
      const page = {
        depends: matcher
      };
      const data = {
        testData: 'Y'
      };

      const result = isActivePage(page, data);

      expect(result).to.be.true;
      expect(matcher.calledWith(data)).to.be.true;
    });
    test('matches against array', () => {
      const page = {
        depends: [
          { testData: 'N' },
          { testData: 'Y' }
        ]
      };
      const data = {
        testData: 'Y'
      };

      const result = isActivePage(page, data);

      expect(result).to.be.true;
    });
  });
});
