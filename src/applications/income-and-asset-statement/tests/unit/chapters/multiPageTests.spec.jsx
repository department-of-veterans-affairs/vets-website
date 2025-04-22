import { expect } from 'chai';
import { render } from '@testing-library/react';
import { formatDateShort } from 'platform/utilities/date';
import { formatCurrency, formatFullNameNoSuffix } from '../../../helpers';
import { relationshipLabels } from '../../../labels';

export const testOptionsIsItemIncomplete = (options, baseItem) => {
  describe('isItemIncomplete function', () => {
    Object.keys(baseItem).forEach(field => {
      it(`should return true if ${field} is missing`, () => {
        expect(options.isItemIncomplete({ ...baseItem, [field]: undefined })).to
          .be.true;
      });
    });

    it('should return false if all required fields are present', () => {
      expect(options.isItemIncomplete(baseItem)).to.be.false;
    });
  });
};

export const testOptionsIsItemIncompleteWithZeroes = (options, baseItem) => {
  describe('isItemIncomplete function', () => {
    it('should return false if all required fields are present and values are zeroes', () => {
      expect(options.isItemIncomplete(baseItem)).to.be.false;
    });
  });
};

export const testOptionsTextGetItemName = options => {
  describe('text getItemName function', () => {
    const testCases = [
      { recipientRelationship: 'SPOUSE', expected: relationshipLabels.SPOUSE },
      { recipientRelationship: 'CHILD', expected: relationshipLabels.CHILD },
      { recipientRelationship: 'PARENT', expected: relationshipLabels.PARENT },
      { recipientRelationship: 'OTHER', expected: relationshipLabels.OTHER },
    ];

    testCases.forEach(({ recipientRelationship, expected }) => {
      it(`should return "${expected}" for recipient relationship "${recipientRelationship}"`, () => {
        const item = { recipientRelationship };
        expect(options.text.getItemName(item)).to.equal(expected);
      });
    });

    it('should return undefined if recipient relationship is missing', () => {
      expect(options.text.getItemName({})).to.be.undefined;
    });

    it('should return undefined if recipient relationship is not in labels', () => {
      const item = { recipientRelationship: 'UNKNOWN' };
      expect(options.text.getItemName(item)).to.be.undefined;
    });
  });
};

export const testOptionsTextGetItemNameRecurringIncome = options => {
  describe('text getItemName function', () => {
    it('should return "Veteran’s income from Walmart" if recipient is Veteran and payer is defined', () => {
      const item = {
        recipientRelationship: 'VETERAN',
        payer: 'Walmart',
      };
      expect(options.text.getItemName(item)).to.equal(
        'Veteran’s income from Walmart',
      );
    });

    it('should return "Full Name’s income from FedEx" if recipient is not Veteran', () => {
      const item = {
        recipientRelationship: 'SPOUSE',
        recipientName: {
          first: 'Robin',
          last: 'Smith',
        },
        payer: 'FedEx',
      };
      const expectedName = formatFullNameNoSuffix(item.recipientName);
      expect(options.text.getItemName(item)).to.equal(
        `${expectedName}’s income from FedEx`,
      );
    });

    it('should return false if relationship is missing', () => {
      const item = {
        payer: 'FedEx',
      };
      expect(options.text.getItemName(item)).to.be.false;
    });

    it('should return false if payer is missing', () => {
      const item = {
        recipientRelationship: 'VETERAN',
      };
      expect(options.text.getItemName(item)).to.be.false;
    });

    it('should return false if relationship is null', () => {
      const item = {
        recipientRelationship: null,
        recipientName: {
          first: 'Alex',
          last: 'Smith',
        },
        payer: 'FedEx',
      };
      expect(options.text.getItemName(item)).to.be.false;
    });

    it('should return false if payer is null', () => {
      const item = {
        recipientRelationship: 'SPOUSE',
        recipientName: {
          first: 'Alex',
          last: 'Smith',
        },
        payer: null,
      };
      expect(options.text.getItemName(item)).to.be.false;
    });

    it('should return false if payer is an empty string', () => {
      const item = {
        recipientRelationship: 'CHILD',
        recipientName: {
          first: 'Jamie',
          last: 'Doe',
        },
        payer: '',
      };
      expect(options.text.getItemName(item)).to.be.false;
    });
  });
};

export const testOptionsTextCardDescription = (
  options,
  baseItem,
  labels = {},
) => {
  describe('text cardDescription function', () => {
    it('should return a description list when item exists', () => {
      const { container, getAllByText } = render(
        options.text.cardDescription(baseItem),
      );

      expect(container.querySelector('li')).to.exist;

      // Define key-based formatters
      const formatters = {
        recipientRelationship: val => labels?.[val] || val,
        incomeType: val => labels?.[val] || val,
        assetType: val => labels?.[val] || val,
        incomeGenerationMethod: val => labels?.[val] || val,
        transferMethod: val => labels?.[val] || val,
        grossMonthlyIncome: formatCurrency,
        grossAnnualAmount: formatCurrency,
        ownedPortionValue: formatCurrency,
        fairMarketValue: formatCurrency,
        capitalGainValue: formatCurrency,
        marketValueAtEstablishment: formatCurrency,
        waivedGrossMonthlyIncome: formatCurrency,
        transferDate: formatDateShort,
        establishedDate: formatDateShort,
      };

      Object.entries(baseItem).forEach(([key, value]) => {
        const formattedValue = formatters[key] ? formatters[key](value) : value;
        expect(getAllByText(formattedValue)).to.exist;
      });
    });

    // Add test case for items that are undefined
  });
};
