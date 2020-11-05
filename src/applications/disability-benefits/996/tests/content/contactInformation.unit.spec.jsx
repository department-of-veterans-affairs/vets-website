import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import {
  formatPhone,
  getCountryName,
  contactInfoDescription,
} from '../../content/contactInformation';

describe('contact information content', () => {
  describe('formatPhone', () => {
    // function only expects a 10-digit number
    it('should format a phone number', () => {
      [
        {
          number: '',
          result: '',
        },
        {
          number: '12345',
          result: '12345',
        },
        {
          number: '1234567890',
          result: '123-456-7890',
        },
      ].forEach(test => {
        expect(formatPhone(test.number)).to.equal(test.result);
      });
    });
  });

  describe('get country', () => {
    it('should return a country name based on the code', () => {
      [
        {
          code: '',
          result: '',
        },
        {
          code: 'USA',
          result: '',
        },
        {
          code: 'BEL',
          result: 'Belgium',
        },
        {
          code: 'ESP',
          result: 'Spain',
        },
      ].forEach(test => {
        expect(getCountryName(test.code)).to.equal(test.result);
      });
    });
  });

  describe('contactInfoDescription', () => {
    it('should render content', () => {
      const data = {
        formData: {
          veteran: {
            phoneNumber: '5558001212',
            emailAddress: 'someone@famous.com',
            street: '123 Main Blvd',
            street2: 'Floor 33',
            street3: 'Suite 55',
            city: 'Hollywood',
            state: 'CA',
            zipCode5: '90210',
            country: 'DEU',
          },
        },
      };
      const ContactInfo = () => <>{contactInfoDescription(data)}</>;
      const tree = shallow(<ContactInfo />);
      const address = tree.find('.blue-bar-block');
      const text = address.text();

      expect(address).to.have.lengthOf(1);
      expect(text).to.contain('555-800-1212');
      expect(text).to.contain('someone@famous.com');
      expect(text).to.contain('123 Main Blvd');
      expect(text).to.contain('Floor 33');
      expect(text).to.contain('Suite 55');
      expect(text).to.contain('Hollywood, CA 90210');
      expect(text).to.contain('Germany');
      tree.unmount();
    });
  });
});
