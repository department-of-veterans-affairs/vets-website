import { expect } from 'chai';
import { obfuscate, obfuscateAriaLabel } from '../../helpers';

describe('helpers', () => {
  describe('obfuscate', () => {
    it('shows only last 4 digits by default', () => {
      expect(obfuscate('1234567890')).to.eql('●●●●●●7890');
    });
    it('shows only last 4 digits by default for short numbers', () => {
      expect(obfuscate('12345')).to.eql('●2345');
    });
    it('shows only last 4 digits by default for long numbers', () => {
      expect(obfuscate('92837123847129834719283423948234')).to.eql(
        '●●●●●●●●●●●●●●●●●●●●●●●●●●●●8234',
      );
    });
  });

  describe('obfuscateAriaLabel', () => {
    it('shows only last 4 digits by default', () => {
      expect(obfuscateAriaLabel('1234567890')).to.eql('Ending in 7,8,9,0');
    });
    it('shows only last 4 digits by default for short numbers', () => {
      expect(obfuscateAriaLabel('12345')).to.eql('Ending in 2,3,4,5');
    });
    it('shows only last 4 digits by default for long numbers', () => {
      expect(obfuscateAriaLabel('92837123847129834719283423948234')).to.eql(
        'Ending in 8,2,3,4',
      );
    });
  });
});
