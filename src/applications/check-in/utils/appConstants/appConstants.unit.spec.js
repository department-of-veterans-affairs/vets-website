import { expect } from 'chai';
import { getLabelForPhone } from './index';

describe('check in utils', () => {
  describe('getLabelForPhone', () => {
    it('should return the default value of phone', () => {
      const expected = 'phone';

      expect(getLabelForPhone()).to.equal(expected);
    });
    it('should return home phone', () => {
      const expected = 'home phone';

      expect(getLabelForPhone('homePhone')).to.equal(expected);
    });
    it('should return work phone', () => {
      const expected = 'work phone';

      expect(getLabelForPhone('workPhone')).to.equal(expected);
    });
    it('should return mobile phone', () => {
      const expected = 'mobile phone';

      expect(getLabelForPhone('mobilePhone')).to.equal(expected);
    });
    it('should capitalize the first letter of the phone type', () => {
      const expected = 'Mobile phone';

      expect(
        getLabelForPhone('mobilePhone', { capitalizeFirstLetter: true }),
      ).to.equal(expected);
    });
  });
});
