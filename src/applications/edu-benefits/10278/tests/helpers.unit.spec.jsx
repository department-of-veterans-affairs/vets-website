import { expect } from 'chai';
import {
  getFullName,
  organizationRepresentativesArrayOptions,
} from '../helpers';

describe('organizationRepresentativesArrayOptions helpers', () => {
  describe('getFullName', () => {
    it('should return null when fullName is missing', () => {
      expect(getFullName()).to.equal(null);
      expect(getFullName(null)).to.equal(null);
    });

    it('should return "First Last" when middle name is missing', () => {
      const fullName = { first: 'John', last: 'Doe' };
      expect(getFullName(fullName)).to.equal('John Doe');
    });

    it('should return "First Middle Last" when all parts exist', () => {
      const fullName = { first: 'John', middle: 'Q', last: 'Doe' };
      expect(getFullName(fullName)).to.equal('John Q Doe');
    });

    it('should trim extra whitespace and ignore blank strings', () => {
      const fullName = { first: '  John  ', middle: '   ', last: '  Doe ' };
      expect(getFullName(fullName)).to.equal('John Doe');
    });

    it('should return empty string when all name parts are empty', () => {
      const fullName = { first: '', middle: '', last: '' };
      expect(getFullName(fullName)).to.equal('');
    });
  });

  describe('organizationRepresentativesArrayOptions', () => {
    it('should define required array builder options correctly', () => {
      expect(organizationRepresentativesArrayOptions.arrayPath).to.equal(
        'representatives',
      );
      expect(organizationRepresentativesArrayOptions.nounSingular).to.equal(
        'representative',
      );
      expect(organizationRepresentativesArrayOptions.nounPlural).to.equal(
        'representatives',
      );
      expect(organizationRepresentativesArrayOptions.required).to.equal(true);
    });

    it('should mark item incomplete when first or last name is missing', () => {
      const incompleteNoFirst = { fullName: { last: 'Doe' } };
      const incompleteNoLast = { fullName: { first: 'John' } };
      const incompleteMissingFullName = {};

      expect(
        organizationRepresentativesArrayOptions.isItemIncomplete(
          incompleteNoFirst,
        ),
      ).to.equal(true);

      expect(
        organizationRepresentativesArrayOptions.isItemIncomplete(
          incompleteNoLast,
        ),
      ).to.equal(true);

      expect(
        organizationRepresentativesArrayOptions.isItemIncomplete(
          incompleteMissingFullName,
        ),
      ).to.equal(true);
    });

    it('should mark item complete when first and last name exist', () => {
      const complete = { fullName: { first: 'John', last: 'Doe' } };

      expect(
        organizationRepresentativesArrayOptions.isItemIncomplete(complete),
      ).to.equal(false);
    });

    it('should return the correct cancel button text', () => {
      expect(
        organizationRepresentativesArrayOptions.text.cancelAddButtonText(),
      ).to.equal('Cancel adding this individual’s information');

      expect(
        organizationRepresentativesArrayOptions.text.cancelEditButtonText(),
      ).to.equal('Cancel editing this individual’s information');
    });

    it('should return full name via getItemName', () => {
      const item = { fullName: { first: 'Jane', middle: 'A', last: 'Smith' } };
      expect(
        organizationRepresentativesArrayOptions.text.getItemName(item),
      ).to.equal('Jane A Smith');
    });

    it('should return null via getItemName when fullName is missing', () => {
      const item = {};
      expect(
        organizationRepresentativesArrayOptions.text.getItemName(item),
      ).to.equal(null);
    });

    it('should use organizationName from fullData for cardDescription', () => {
      const item = { fullName: { first: 'John', last: 'Doe' } };
      const fullData = { organizationName: 'Acme Corp' };

      expect(
        organizationRepresentativesArrayOptions.text.cardDescription(
          item,
          0,
          fullData,
        ),
      ).to.equal('Acme Corp');
    });

    it('should return empty string for cardDescription when organizationName is missing', () => {
      const item = { fullName: { first: 'John', last: 'Doe' } };

      expect(
        organizationRepresentativesArrayOptions.text.cardDescription(
          item,
          0,
          {},
        ),
      ).to.equal('');

      expect(
        organizationRepresentativesArrayOptions.text.cardDescription(
          item,
          0,
          null,
        ),
      ).to.equal('');
    });

    it('should have the correct summaryTitle', () => {
      expect(
        organizationRepresentativesArrayOptions.text.summaryTitle,
      ).to.equal('Review the names of organization’s representatives');
    });
  });
});
