import { expect } from 'chai';
import {
  validateNameMatchesUser,
  fullNameToString,
  transformPhoneNumberObject,
  transformContactInfoMailingAddress,
} from '../helpers';

describe('0989 Helpers', () => {
  describe('validateNameMatchesUser', () => {
    let errors;
    const formData = {
      applicantName: {
        first: 'John',
        last: 'Doe',
      },
    };

    beforeEach(() => {
      errors = {
        messages: [],
        addError(message) {
          this.messages.push(message);
        },
      };
    });

    it('correctly matches full names', () => {
      validateNameMatchesUser(errors, 'John Doe', formData);
      expect(errors.messages.length).to.eq(0);
    });

    it('correctly does nothing with no input', () => {
      validateNameMatchesUser(errors, 'Jane Doe', formData);
      expect(errors.messages.length).to.eq(1);
      expect(errors.messages[0]).to.eq(
        'Enter your name exactly as it appears on your form: John Doe',
      );
    });
  });

  describe('fullNameToString', () => {
    it('gets converts a first/last name', () => {
      expect(fullNameToString({ first: 'John', last: 'Doe' })).to.eq(
        'John Doe',
      );
    });

    it('gets converts a first/middle/last name', () => {
      expect(
        fullNameToString({ first: 'John', middle: 'Kay', last: 'Doe' }),
      ).to.eq('John Kay Doe');
    });

    it('gets converts empty arguments without error', () => {
      expect(fullNameToString({ first: null, last: null })).to.eq(' ');
    });
  });

  describe('transformPhoneNumberObject', () => {
    it('formats things properly with a full object', () => {
      const input = {
        isInternational: true,
        areaCode: '989',
        phoneNumber: '8981233',
        countryCode: '22',
      };
      expect(transformPhoneNumberObject(input)).to.eq('+22 9898981233');
    });

    it('returns an empty string when not enough info available', () => {
      const input = {
        isInternational: true,
        areaCode: '',
        phoneNumber: '',
        countryCode: '22',
      };
      expect(transformPhoneNumberObject(input)).to.eq('');
    });
  });

  describe('transformContactInfoMailingAddress', () => {
    it('transforms the object correctly for a US address', () => {
      const input = {
        addressLine1: '123 Mailing Address St.',
        addressLine2: 'Apt 1',
        addressLine3: '',
        addressType: 'DOMESTIC',
        city: 'Fulton',
        countryName: 'United States',
        countryCodeIso2: 'US',
        countryCodeIso3: 'USA',
        stateCode: 'NY',
        zipCode: '97063',
      };
      expect(transformContactInfoMailingAddress(input)).to.deep.equal({
        isMilitary: false,
        country: 'USA',
        street: '123 Mailing Address St.',
        street2: 'Apt 1',
        street3: '',
        city: 'Fulton',
        state: 'NY',
        postalCode: '97063',
      });
    });

    it('transforms the object correctly for a foreign address', () => {
      const input = {
        addressType: 'INTERNATIONAL',
        addressLine1: '123 Mailing Address St.',
        addressLine2: 'Apt 1',
        addressLine3: '',
        city: 'Fulton',
        countryName: 'Mexico',
        countryCodeIso2: 'MX',
        countryCodeIso3: 'MEX',
        province: 'JAL',
        internationalPostalCode: '12345',
      };
      expect(transformContactInfoMailingAddress(input)).to.deep.equal({
        isMilitary: false,
        country: 'MEX',
        street: '123 Mailing Address St.',
        street2: 'Apt 1',
        street3: '',
        city: 'Fulton',
        state: 'JAL',
        postalCode: '12345',
      });
    });
  });
});
