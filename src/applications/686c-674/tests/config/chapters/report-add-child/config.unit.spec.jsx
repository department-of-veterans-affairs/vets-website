import { expect } from 'chai';
import { arrayBuilderOptions } from '../../../../config/chapters/report-add-child/config';

describe('arrayBuilderOptions', () => {
  it('should have the correct arrayPath, nouns, and maxItems properties', () => {
    expect(arrayBuilderOptions.arrayPath).to.equal('childrenToAdd');
    expect(arrayBuilderOptions.nounSingular).to.equal('child');
    expect(arrayBuilderOptions.nounPlural).to.equal('children');
    expect(arrayBuilderOptions.required).to.be.true;
    expect(arrayBuilderOptions.maxItems).to.equal(10);
  });

  describe('isItemIncomplete', () => {
    it('should return true if any required fields are missing or incomplete', () => {
      const incompleteItem = {
        fullName: { first: '', last: '' },
        birthDate: null,
        ssn: null,
        birthLocation: { location: { postalCode: '' }, outsideUsa: false },
        relationshipToChild: '',
        doesChildLiveWithYou: undefined,
        hasChildEverBeenMarried: undefined,
        incomeInLastYear: undefined,
      };

      const result = arrayBuilderOptions.isItemIncomplete(incompleteItem);
      expect(result).to.be.true;
    });

    it('should return false if all required fields are complete', () => {
      const completeItem = {
        fullName: { first: 'John', last: 'Doe' },
        birthDate: '2020-01-01',
        ssn: '123-45-6789',
        birthLocation: {
          location: { postalCode: '12345', state: 'NY' },
          outsideUsa: false,
        },
        relationshipToChild: 'Son',
        doesChildLiveWithYou: true,
        hasChildEverBeenMarried: false,
        incomeInLastYear: true,
      };

      const result = arrayBuilderOptions.isItemIncomplete(completeItem);
      expect(result).to.be.false;
    });

    it('should return true if birthLocation is incomplete (no postal code)', () => {
      const incompleteItem = {
        fullName: { first: 'Jane', last: 'Doe' },
        birthDate: '2019-06-01',
        ssn: '987-65-4321',
        birthLocation: { location: { postalCode: '' }, outsideUsa: false },
        relationshipToChild: 'Daughter',
        doesChildLiveWithYou: true,
        hasChildEverBeenMarried: false,
        incomeInLastYear: false,
      };

      const result = arrayBuilderOptions.isItemIncomplete(incompleteItem);
      expect(result).to.be.true;
    });

    it('should return true if birthLocation is incomplete (no state)', () => {
      const incompleteItem = {
        fullName: { first: 'Jane', last: 'Doe' },
        birthDate: '2019-06-01',
        ssn: '987-65-4321',
        birthLocation: { location: { postalCode: '12345' }, outsideUsa: false },
        relationshipToChild: 'Daughter',
        doesChildLiveWithYou: true,
        hasChildEverBeenMarried: false,
        incomeInLastYear: false,
      };

      const result = arrayBuilderOptions.isItemIncomplete(incompleteItem);
      expect(result).to.be.true;
    });

    it('should return true if birthLocation is incomplete (outsideUsa is true and no location)', () => {
      const incompleteItem = {
        fullName: { first: 'Jane', last: 'Doe' },
        birthDate: '2019-06-01',
        ssn: '987-65-4321',
        birthLocation: { location: { postalCode: '' }, outsideUsa: true },
        relationshipToChild: 'Daughter',
        doesChildLiveWithYou: true,
        hasChildEverBeenMarried: false,
        incomeInLastYear: false,
      };

      const result = arrayBuilderOptions.isItemIncomplete(incompleteItem);
      expect(result).to.be.true;
    });
  });

  describe('text methods', () => {
    it('should return the correct item name from getItemName', () => {
      const itemName = arrayBuilderOptions.text.getItemName();
      expect(itemName).to.equal('Child');
    });

    it('should return the correct card description from cardDescription', () => {
      const item = { fullName: { first: 'John', last: 'Doe' } };
      const cardDesc = arrayBuilderOptions.text.cardDescription(item);
      expect(cardDesc).to.equal('John Doe');
    });

    it('should return a space for cardDescription when fullName is incomplete', () => {
      const incompleteItem = { fullName: {} };
      const cardDesc = arrayBuilderOptions.text.cardDescription(incompleteItem);
      expect(cardDesc).to.equal(' ');
    });
  });
});
