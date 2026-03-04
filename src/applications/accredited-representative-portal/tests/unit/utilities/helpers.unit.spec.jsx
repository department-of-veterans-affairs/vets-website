import { expect } from 'chai';
import { lastFour } from '../../../utilities/helpers';

describe('helper functions', () => {
  describe('checking ssn', () => {
    it('returns last four digits of ssn', () => {
      expect(lastFour('123456789')).to.equal('6789');
    });

    it('returns last four when there are dashes', () => {
      expect(lastFour('123-45-6789')).to.equal('6789');
    });

    it('returns empty string is ssn is not a string', () => {
      expect(lastFour(123121234)).to.equal('');
      expect(lastFour(null)).to.equal('');
    });
    it('returns empty string is ssn has no digits', () => {
      expect(lastFour('test')).to.equal('');
    });
  });
});
