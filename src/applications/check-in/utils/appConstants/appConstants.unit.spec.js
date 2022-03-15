import { expect } from 'chai';
import { getLabelForPhoneOrAddress } from './index';

describe('check in utils', () => {
  describe('getLabelForPhoneOrAddress', () => {
    it('should return the default value of phone', () => {
      const expected = 'phone';

      expect(getLabelForPhoneOrAddress()).to.equal(expected);
    });
    it('should return home phone', () => {
      const expected = 'home phone';

      expect(getLabelForPhoneOrAddress('homePhone')).to.equal(expected);
    });
    it('should return work phone', () => {
      const expected = 'work phone';

      expect(getLabelForPhoneOrAddress('workPhone')).to.equal(expected);
    });
    it('should return mobile phone', () => {
      const expected = 'mobile phone';

      expect(getLabelForPhoneOrAddress('mobilePhone')).to.equal(expected);
    });
    it('should return address', () => {
      const expected = 'address';

      expect(getLabelForPhoneOrAddress('address')).to.equal(expected);
    });
    it('should return home address', () => {
      const expected = 'home address';

      expect(getLabelForPhoneOrAddress('homeAddress')).to.equal(expected);
    });
    it('should return mailing address', () => {
      const expected = 'mailing address';

      expect(getLabelForPhoneOrAddress('mailingAddress')).to.equal(expected);
    });
    it('should capitalize the first letter of the label type', () => {
      const expected = 'Mobile phone';

      expect(
        getLabelForPhoneOrAddress('mobilePhone', {
          capitalizeFirstLetter: true,
        }),
      ).to.equal(expected);
    });
  });
});
