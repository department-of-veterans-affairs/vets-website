import { expect } from 'chai';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  transformMailingAddress,
  transformPhoneNumberObject,
  CustomReviewTopContent,
} from '../helpers';

describe('0803 Helpers', () => {
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

  describe('transformMailingAddress', () => {
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
      expect(transformMailingAddress(input)).to.deep.equal({
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
      expect(transformMailingAddress(input)).to.deep.equal({
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
  describe('CustomReviewTopContent', () => {
    it('renders correctly', () => {
      const html = renderToStaticMarkup(CustomReviewTopContent());

      expect(html).to.include('Review your form');
    });
  });
});
