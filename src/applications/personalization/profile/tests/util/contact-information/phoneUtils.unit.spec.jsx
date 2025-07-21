import { expect } from 'chai';
import * as phoneUtils from '@@vap-svc/util/contact-information/phoneUtils';

describe('Profile utils', () => {
  describe('contact-information utils', () => {
    describe('phoneConvertCleanDataToPayload', () => {
      it('should return the correct payload when inputPhoneNumber is a string (legacy view)', () => {
        const data = {
          inputPhoneNumber: '5551234567',
          extension: '321',
        };
        const fieldName = 'homePhone';

        const expected = {
          countryCode: '1',
          areaCode: '555',
          phoneNumber: '1234567',
          extension: '321',
          phoneType: 'HOME',
        };

        expect(
          phoneUtils.phoneConvertCleanDataToPayload(data, fieldName),
        ).to.deep.equal(expected);
      });

      it('should return payload for domestic numbers', () => {
        const data = {
          inputPhoneNumber: {
            contact: '5551234567',
            callingCode: '1',
            countryCode: 'US',
          },
        };
        const fieldName = 'workPhone';

        const expected = {
          countryCode: '1',
          phoneNumber: '1234567',
          areaCode: '555',
          phoneType: 'WORK',
        };

        expect(
          phoneUtils.phoneConvertCleanDataToPayload(data, fieldName),
        ).to.deep.equal(expected);
      });

      it('should return payload for international numbers', () => {
        const data = {
          inputPhoneNumber: {
            contact: '301234567',
            callingCode: '44',
            countryCode: 'GB',
          },
        };
        const fieldName = 'workPhone';

        const expected = {
          isInternational: true,
          countryCode: '44',
          phoneNumber: '301234567',
          phoneType: 'WORK',
        };

        expect(
          phoneUtils.phoneConvertCleanDataToPayload(data, fieldName),
        ).to.deep.equal(expected);
      });
    });
  });
});
