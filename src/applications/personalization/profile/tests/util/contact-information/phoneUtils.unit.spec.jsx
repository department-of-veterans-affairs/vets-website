import { expect } from 'chai';
import * as phoneUtils from '@@vap-svc/util/contact-information/phoneUtils';

describe('Profile utils', () => {
  describe('contact-information utils', () => {
    describe('phoneConvertNextValueToCleanData', () => {
      // in-line validation from the VaTelephoneInput component should prevent
      // users from submitting invalid data
      it('strips non-digits from the input phone number', () => {
        const result = phoneUtils.phoneConvertNextValueToCleanData({
          inputPhoneNumber: {
            contact: '(555) 123-4567a',
            callingCode: '1',
            countryCode: 'US',
          },
        });

        expect(result.phoneNumber).to.equal('1234567');
        expect(result.areaCode).to.equal('555');
      });
    });

    describe('phoneConvertCleanDataToPayload', () => {
      it('returns the correct payload when inputPhoneNumber is a string (legacy view)', () => {
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

      it('returns the correct payload for domestic numbers', () => {
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

      it('returns the correct payload for international numbers', () => {
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

      it('returns strings when given number values', () => {
        const data = {
          inputPhoneNumber: {
            contact: 5551234567,
            callingCode: 1,
            countryCode: 'US',
            extension: 123,
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

      // inputPhoneNumber is required, as are contact, callingCode, and countryCode
      // so in-line validations should prevent users from submitting null data
      it('does not return fields that are missing or undefined', () => {
        const data = {
          inputPhoneNumber: {
            callingCode: undefined,
            // missing all other fields
          },
        };
        const fieldName = null;

        const expected = {
          countryCode: '1', // Should default to US country code if not explicitly set
        };

        expect(
          phoneUtils.phoneConvertCleanDataToPayload(data, fieldName),
        ).to.deep.equal(expected);
      });
    });
  });
});
