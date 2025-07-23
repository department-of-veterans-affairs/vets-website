import { expect } from 'chai';
import {
  getItemName,
  getCardDescription,
  getDeleteTitle,
  getDeleteYes,
  getDeleteDescription,
  isItemIncomplete,
} from '../../../../utils/helpers/nextOfKinUtils';

describe('Next of Kin Utils', () => {
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
      expect(result).to.equal('Delete this next of kin?');
    });
  });

  describe('getDeleteYes', () => {
    it('should return the delete confirmation text', () => {
      const result = getDeleteYes();
      expect(result).to.equal('Yes, delete this next of kin');
    });
  });

  describe('getDeleteDescription', () => {
    it('should return the full delete description when first and last name are provided', () => {
      const item = { itemData: { fullName: { first: 'John', last: 'Doe' } } };
      const result = getDeleteDescription(item);
      expect(result).to.equal(
        'This will delete John Doe and all the information from your list of next of kins.',
      );
    });

    it('should return a fallback delete description when names are missing', () => {
      const itemWithMissingNames = { itemData: { fullName: {} } };
      const result = getDeleteDescription(itemWithMissingNames);
      expect(result).to.equal(
        'This will delete this contact and all the information from your list of next of kins.',
      );
    });

    it('should return a fallback delete description if item is undefined', () => {
      const result = getDeleteDescription(undefined);
      expect(result).to.equal(
        'This will delete this contact and all the information from your list of next of kins.',
      );
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
