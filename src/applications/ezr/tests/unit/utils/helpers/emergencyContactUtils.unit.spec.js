import { expect } from 'chai';
import {
  getItemName,
  getCardDescription,
  getDeleteTitle,
  getDeleteYes,
  getDeleteDescription,
} from '../../../../utils/helpers/emergencyContactUtils';

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
      expect(result).to.equal('Delete this emergency contact?');
    });
  });

  describe('getDeleteYes', () => {
    it('should return the delete confirmation text', () => {
      const result = getDeleteYes();
      expect(result).to.equal('Yes, delete this emergency contact');
    });
  });

  describe('getDeleteDescription', () => {
    it('should return the full delete description when first and last name are provided', () => {
      const item = { fullName: { first: 'John', last: 'Doe' } };
      const result = getDeleteDescription(item);
      expect(result).to.equal(
        'This will delete John Doe and all the information from your list of emergency contacts.',
      );
    });

    it('should return a fallback delete description when names are missing', () => {
      const itemWithMissingNames = { fullName: {} };
      const result = getDeleteDescription(itemWithMissingNames);
      expect(result).to.equal(
        'This will delete this contact and all the information from your list of emergency contacts.',
      );
    });

    it('should return a fallback delete description if item is undefined', () => {
      const result = getDeleteDescription(undefined);
      expect(result).to.equal(
        'This will delete this contact and all the information from your list of emergency contacts.',
      );
    });
  });
});
