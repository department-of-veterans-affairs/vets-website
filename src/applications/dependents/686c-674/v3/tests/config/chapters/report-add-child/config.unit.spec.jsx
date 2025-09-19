import { render } from '@testing-library/react';
import { expect } from 'chai';
import { arrayBuilderOptions } from '../../../../config/chapters/report-add-child/config';

describe('arrayBuilderOptions', () => {
  it('should have the correct arrayPath, nouns, and maxItems properties', () => {
    expect(arrayBuilderOptions.arrayPath).to.equal('childrenToAdd');
    expect(arrayBuilderOptions.nounSingular).to.equal('child');
    expect(arrayBuilderOptions.nounPlural).to.equal('children');
    expect(arrayBuilderOptions.required).to.be.true;
    expect(arrayBuilderOptions.maxItems).to.equal(20);
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

    it('should return false if all required fields for a child are complete', () => {
      const completeChild = {
        fullName: { first: 'John', last: 'Doe' },
        birthDate: '2000-02-01',
        ssn: '432432432',
        birthLocation: {
          location: {
            city: 'Fakesville',
            state: 'AK',
            postalCode: '43222',
          },
          outsideUsa: false,
        },
        isBiologicalChild: true,
        isBiologicalChildOfSpouse: false,
        relationshipToChild: { stepchild: true },
        dateEnteredHousehold: '2023-02-01',
        biologicalParentName: {
          first: 'Jane',
          last: 'Doe',
        },
        biologicalParentDob: '1990-02-01',
        biologicalParentSsn: '432432432',
        doesChildHaveDisability: false,
        doesChildLiveWithYou: false,
        hasChildEverBeenMarried: false,
        incomeInLastYear: 'Y',
        livingWith: {
          first: 'John',
          last: 'Doe II',
        },
        address: {
          country: 'DZA',
          street: 'test address',
          city: 'test city',
          postalCode: '43242',
        },
        'view:isUnmarriedAndInSchool': 'Y',
        'view:hasReceivedBenefits': 'N',
      };

      const result = arrayBuilderOptions.isItemIncomplete(completeChild);
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

    it('should return true if isBiologicalChild is false and relationshipToChild is empty', () => {
      const item = {
        fullName: { first: 'Tim', last: 'Jones' },
        birthDate: '2005-03-01',
        ssn: '123123123',
        birthLocation: {
          location: { city: 'City', state: 'ST', postalCode: '12345' },
          outsideUsa: false,
        },
        isBiologicalChild: false,
        relationshipToChild: {},
        doesChildLiveWithYou: true,
        hasChildEverBeenMarried: false,
      };
      expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
    });

    it('should return true if stepchild info is incomplete', () => {
      const item = {
        fullName: { first: 'Anna', last: 'Lee' },
        birthDate: '2010-01-01',
        ssn: '111-22-3333',
        isBiologicalChild: false,
        relationshipToChild: { stepchild: true },
        birthLocation: {
          location: { city: 'Here', state: 'NY', postalCode: '10001' },
          outsideUsa: false,
        },
        doesChildLiveWithYou: true,
        hasChildEverBeenMarried: false,
      };
      expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
    });

    it('should return true if doesChildHaveDisability is true but permanent disability info missing', () => {
      const item = {
        fullName: { first: 'Luna', last: 'Star' },
        birthDate: '2008-07-04',
        ssn: '222-33-4444',
        isBiologicalChild: true,
        relationshipToChild: {},
        birthLocation: {
          location: { city: 'Nowhere', state: 'WI', postalCode: '54321' },
          outsideUsa: false,
        },
        doesChildLiveWithYou: true,
        hasChildEverBeenMarried: false,
        doesChildHaveDisability: true,
      };
      expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
    });

    // it('should return true if child was married but no end date or reason provided', () => {
    //   const item = {
    //     fullName: { first: 'Bob', last: 'Ross' },
    //     birthDate: '1999-01-01',
    //     ssn: '999-88-7777',
    //     isBiologicalChild: true,
    //     birthLocation: {
    //       location: { city: 'Happy Town', state: 'NM', postalCode: '13232' },
    //       outsideUsa: false,
    //     },
    //     relationshipToChild: {},
    //     doesChildLiveWithYou: true,
    //     hasChildEverBeenMarried: true,
    //     doesChildHaveDisability: false,
    //     doesChildHavePermanentDisability: false,
    //   };
    //   expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
    // });

    it('should return true if marriageEndReason is "other" but no description provided', () => {
      const item = {
        fullName: { first: 'Zoe', last: 'Smith' },
        birthDate: '1998-05-05',
        ssn: '111-22-3333',
        birthLocation: {
          location: { city: 'Somewhere', state: 'PA', postalCode: '11111' },
          outsideUsa: false,
        },
        isBiologicalChild: true,
        relationshipToChild: {},
        doesChildLiveWithYou: true,
        hasChildEverBeenMarried: true,
        marriageEndDate: '2020-01-01',
        marriageEndReason: 'other',
      };
      expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
    });

    it('should return true if doesChildLiveWithYou is false but address or livingWith is missing', () => {
      const item = {
        fullName: { first: 'Kyle', last: 'Smith' },
        birthDate: '2014-11-11',
        ssn: '444-55-6666',
        birthLocation: {
          location: { city: 'Nowhere', state: 'DC', postalCode: '20001' },
          outsideUsa: false,
        },
        isBiologicalChild: true,
        relationshipToChild: {},
        doesChildLiveWithYou: false,
        hasChildEverBeenMarried: false,
        address: {},
        livingWith: { first: '', last: '' },
      };
      expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
    });
  });

  describe('text methods', () => {
    it('should return the correct card title from getItemName', () => {
      const item = { fullName: { first: 'John', last: 'Doe' } };
      const { getByText } = render(arrayBuilderOptions.text.getItemName(item));
      expect(getByText('John Doe')).to.exist;
    });

    it('should return a space for getItemName when fullName is incomplete', () => {
      const incompleteItem = { fullName: {} };
      const { container } = render(
        arrayBuilderOptions.text.getItemName(incompleteItem),
      );
      const text = container.textContent;
      expect(text).to.equal('');
    });
  });
});
