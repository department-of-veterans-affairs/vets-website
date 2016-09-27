import { expect } from 'chai';
import sinon from 'sinon';

import { isActivePage } from '../../../src/js/common/utils/helpers.js';

describe('Helpers unit tests', () => {
  describe('isActivePage', () => {
    it('matches against data', () => {
      const page = {
        depends: { testData: 'Y' }
      };
      const data = {
        testData: 'Y'
      };

      const result = isActivePage(page, data);

      expect(result).to.be.true;
    });
    it('false with mismatched data', () => {
      const page = {
        depends: { testData: 'Y' }
      };
      const data = {
        testData: 'N'
      };

      const result = isActivePage(page, data);

      expect(result).to.be.false;
    });
    it('matches using function', () => {
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
  });
});
