import { expect } from 'chai';

import { getFullNameLabels } from '../../helpers';

describe('21-4140 helpers', () => {
  describe('getFullNameLabels', () => {
    it('returns "Middle initial" for the middle name label by default', () => {
      expect(getFullNameLabels('middle name')).to.equal('Middle initial');
    });

    it('returns the middle name label unchanged when skip flag is set', () => {
      expect(getFullNameLabels('middle name', true)).to.equal('Middle name');
    });

    it('capitalizes generic labels', () => {
      expect(getFullNameLabels('first name')).to.equal('First name');
    });

    it('handles empty or single character labels', () => {
      expect(getFullNameLabels('')).to.equal('');
      expect(getFullNameLabels('a')).to.equal('A');
    });
  });
});
