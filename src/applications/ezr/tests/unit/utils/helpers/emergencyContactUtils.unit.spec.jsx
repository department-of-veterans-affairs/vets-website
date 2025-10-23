import { expect } from 'chai';
import {
  getItemName,
  getCardDescription,
  getDeleteTitle,
  getDeleteYes,
  getDeleteDescription,
  isItemIncomplete,
} from '../../../../utils/helpers/emergencyContactUtils';

import content from '../../../../locales/en/content.json';

describe('Emergency Contact Utils', () => {
  describe('getItemName', () => {
    it('should return full name when first and last name are provided', () => {
      const item = { fullName: { first: 'John', last: 'Doe' } };
      const result = getItemName(item);
      expect(result).to.equal('John Doe');
    });

    it('should return an empty string if first or last name is missing', () => {
      const itemWithMissingFirst = { fullName: { last: 'Doe' } };
      const itemWithMissingLast = { fullName: { first: 'John' } };
      expect(getItemName(itemWithMissingFirst)).to.equal('');
      expect(getItemName(itemWithMissingLast)).to.equal('');
    });

    it('should return an empty string if item or fullName is undefined', () => {
      expect(getItemName(undefined)).to.equal('');
      expect(getItemName({})).to.equal('');
    });
  });

  describe('getCardDescription', () => {
    it('should return the primary phone number if available', () => {
      const item = { primaryPhone: '5551234567' };
      const result = getCardDescription(item);
      expect(result).to.equal('5551234567');
    });

    it('should return an empty string if primary phone number is not available', () => {
      const itemWithoutPhone = {};
      const result = getCardDescription(itemWithoutPhone);
      expect(result).to.equal('');
    });

    it('should return an empty string if item is undefined', () => {
      const result = getCardDescription(undefined);
      expect(result).to.equal('');
    });
  });

  describe('getDeleteTitle', () => {
    it('should return the delete title text', () => {
      const result = getDeleteTitle();
      expect(result).to.equal(content['emergency-contact-delete-title']);
    });
  });

  describe('getDeleteYes', () => {
    it('should return the delete confirmation text', () => {
      const result = getDeleteYes();
      expect(result).to.equal(content['emergency-contact-delete-yes']);
    });
  });

  describe('getDeleteDescription', () => {
    it('should return the full delete description when first and last name are provided', () => {
      const result = getDeleteDescription();
      expect(result).to.equal(content['emergency-contact-delete-description']);
    });
  });

  describe('isItemIncomplete', () => {
    it('should return true if fullName missing', () => {
      const item = {
        fullName: {},
        primaryPhone: '0123456789',
        relationship: 'BROTHER',
        address: {
          street: '1 Test Street',
          city: 'Los Angeles',
          country: 'USA',
        },
      };
      let result = isItemIncomplete(item);
      expect(result).to.be.true;

      item.fullName.first = 'John';
      result = isItemIncomplete(item);
      expect(result).to.be.true;

      item.fullName.first = null;
      item.fullName.last = 'Doe';
      result = isItemIncomplete(item);
      expect(result).to.be.true;
    });

    it('should return true if primaryPhone missing', () => {
      const item = {
        fullName: {
          first: 'John',
          last: 'Doe',
        },
        primaryPhone: null,
        relationship: 'BROTHER',
        address: {
          street: '1 Test Street',
          city: 'Los Angeles',
          country: 'USA',
        },
      };
      const result = isItemIncomplete(item);
      expect(result).to.be.true;
    });

    it('should return true if relationship missing', () => {
      const item = {
        fullName: {
          first: 'John',
          last: 'Doe',
        },
        primaryPhone: '0123456789',
        relationship: null,
        address: {
          street: '1 Test Street',
          city: 'Los Angeles',
          country: 'USA',
        },
      };
      const result = isItemIncomplete(item);
      expect(result).to.be.true;
    });

    it('should return true if any part of the address is missing', () => {
      const item = {
        fullName: {
          first: 'John',
          last: 'Doe',
        },
        primaryPhone: '0123456789',
        relationship: 'BROTHER',
        address: {},
      };

      let result = isItemIncomplete(item);
      expect(result).to.be.true;

      item.address.street = '1 Test Street';
      result = isItemIncomplete(item);
      expect(result).to.be.true;

      item.address.city = 'Los Angeles';
      result = isItemIncomplete(item);
      expect(result).to.be.true;
    });

    it('should return true if all of the required fields have data', () => {
      const item = {
        fullName: {
          first: 'John',
          last: 'Doe',
        },
        primaryPhone: '0123456789',
        relationship: 'BROTHER',
        address: {
          street: '1 Test Street',
          city: 'Testerton',
          country: 'USA',
        },
      };
      const result = isItemIncomplete(item);
      expect(result).to.be.false;
    });
  });
});
