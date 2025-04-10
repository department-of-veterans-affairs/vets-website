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
      expect(obfuscate('34719283423948234')).to.eql('●●●●●●●●●●●●●8234');
    });
    it('can specify the number of visible characters', () => {
      expect(obfuscate('1234567890', 2)).to.eql('●●●●●●●●90');
    });
    it('can set the number of visible characters to a higher number', () => {
      expect(obfuscate('987654321', 7)).to.eql('●●7654321');
    });
    it('shows all characters when visible characters equals length', () => {
      expect(obfuscate('6789')).to.eql('6789');
    });
    it('shows all characters when visible characters is greater than length', () => {
      expect(obfuscate('302137745', 10)).to.eql('302137745');
    });
    it('can override the obfuscate character', () => {
      expect(obfuscate('1234567890', undefined, '*')).to.eql('******7890');
    });
    it('can override the obfuscate character and number of visible characters', () => {
      expect(obfuscate('987031022', 3, '🙈')).to.eql('🙈🙈🙈🙈🙈🙈022');
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
      expect(obfuscateAriaLabel('92837123847129834')).to.eql(
        'Ending in 9,8,3,4',
      );
    });
    it('can override the number of visible characters', () => {
      expect(obfuscateAriaLabel('1234567890', 2)).to.eql('Ending in 9,0');
    });
    it('does not add prefix when visible characters equals length', () => {
      expect(obfuscateAriaLabel('345678', 6)).to.eql('345678');
    });
    it('does not add prefix when visible characters is greater than length', () => {
      expect(obfuscateAriaLabel('882362711', 10)).to.eql('882362711');
    });
  });
});
