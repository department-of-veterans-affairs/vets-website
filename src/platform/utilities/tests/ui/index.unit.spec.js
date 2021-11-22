import { expect } from 'chai';
import { formatSSN } from '../../ui/index';

describe('ui/index', () => {
  describe('formatSSN', () => {
    it('should format SSN properly with dashes when entered as one digit', () => {
      const result = formatSSN('123456789');
      expect(result).to.equal('123-45-6789');
    });

    it('should format SSN properly with dashes when entered with dashes', () => {
      const result = formatSSN('123-45-6789');
      expect(result).to.equal('123-45-6789');
    });

    it('should format SSN properly with dashes when entered with spaces', () => {
      const result = formatSSN('123 45 6789');
      expect(result).to.equal('123-45-6789');
    });

    it('should format SSN properly with dashes when fewer than 6 digits are entered', () => {
      const result = formatSSN('1234');
      expect(result).to.equal('123-4');
    });

    it('should format SSN properly with dashes when between 7 and 9 digits are entered', () => {
      const result = formatSSN('1234567');
      expect(result).to.equal('123-45-67');
    });
  });
});
