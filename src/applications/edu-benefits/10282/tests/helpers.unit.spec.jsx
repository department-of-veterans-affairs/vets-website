import { expect } from 'chai';

import { getTransformIntlPhoneNumber } from '../helpers';

describe('10297 Helpers', () => {
  describe('#getTransformIntlPhoneNumber', () => {
    it('should create formatted international phone number with provided details', () => {
      const phoneNumber = {
        callingCode: 1,
        countryCode: 'US',
        contact: '1112223333',
      };

      expect(getTransformIntlPhoneNumber(phoneNumber)).to.equal(
        '+1 1112223333 (US)',
      );
    });
  });
});
