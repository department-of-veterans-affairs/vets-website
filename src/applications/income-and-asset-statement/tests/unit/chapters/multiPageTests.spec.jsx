import { expect } from 'chai';
import { render } from '@testing-library/react';

import { formatDateLong } from 'platform/utilities/date';

import { formatCurrency, formatFullNameNoSuffix } from '../../../helpers';
import { relationshipLabels } from '../../../labels';

/**
 * Unit test helper that verifies the behavior of the `isItemIncomplete` function
 * from array builder options by testing required field presence.
 *
 * For each field in the provided `baseItem`, this function generates a test case that
 * sets the field to `undefined` and expects `isItemIncomplete` to return `true`, indicating
 * the item is considered incomplete without that field. It also verifies that when all
 * fields are present, `isItemIncomplete` returns `false`.
 *
 * @param {Object} options - The array builder options object containing `isItemIncomplete` function.
 * @param {Object} baseItem - A complete item object used as the basis for testing missing fields.
 */
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

/**
 * Unit test helper for verifying the behavior of `getItemName` in array builder text options.
 *
 * Tests the output of the `getItemName` function based on different recipient relationships,
 * including "Veteran" and non-Veteran relationships for recurring income chapters. It also
 * tests edge cases with missing data.
 *
 * @param {Object} options - The `options.text` object containing the `getItemName` function.
 */
export const testOptionsTextGetItemNameRecurringIncome = options => {
  describe('text getItemName function', () => {
    const veteranFullName = { first: 'John', last: 'Doe' };
    const formattedVeteranName = formatFullNameNoSuffix(veteranFullName);
    const recipientName = { first: 'Jane', middle: 'A', last: 'Doe' };
    const formattedRecipientName = formatFullNameNoSuffix(recipientName);

    const mockFormData = {
      veteranFullName,
    };

    it(`should return "${formattedVeteranName}’s income from Walmart" when recipientRelationship is "VETERAN"`, () => {
      const item = {
        recipientRelationship: 'VETERAN',
        payer: 'Walmart',
      };
      expect(options.text.getItemName(item, 0, mockFormData)).to.equal(
        `${formattedVeteranName}’s income from Walmart`,
      );
    });

    Object.keys(relationshipLabels).forEach(relationshipKey => {
      if (relationshipKey !== 'VETERAN') {
        it(`should return "${formattedRecipientName}’s income from Walmart" for relationship "${relationshipKey}"`, () => {
          const item = {
            recipientRelationship: relationshipKey,
            recipientName,
            payer: 'Walmart',
          };
          expect(options.text.getItemName(item, 0, mockFormData)).to.equal(
            `${formattedRecipientName}’s income from Walmart`,
          );
        });
      }
    });

    it('should return false if payer is missing', () => {
      const item = {
        recipientRelationship: 'SPOUSE',
        recipientName,
      };
      expect(options.text.getItemName(item, 0, mockFormData)).to.be.false;
    });
  });
};

/**
 * Unit test helper that verifies the `cardDescription` text rendering for array builder items.
 *
 * It renders the `cardDescription` function from the `options` object with a given `baseItem`,
 * applies formatting rules to each property of the item, and asserts that the formatted values
 * are present in the rendered output.
 *
 * @param {Object} options - The array builder options object containing a `text.cardDescription` function.
 * @param {Object} baseItem - The item object to test against, containing keys and values to be rendered.
 * @param {Object} labels - Optional mapping of field values to human-readable labels.
 */
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
        trustType: val => labels?.[val] || val,
        incomeGenerationMethod: val => labels?.[val] || val,
        transferMethod: val => labels?.[val] || val,
        revocable: val => (val ? 'Revocable' : 'Irrevocable'),
        grossMonthlyIncome: formatCurrency,
        grossAnnualAmount: formatCurrency,
        ownedPortionValue: formatCurrency,
        fairMarketValue: formatCurrency,
        capitalGainValue: formatCurrency,
        marketValueAtEstablishment: formatCurrency,
        waivedGrossMonthlyIncome: formatCurrency,
        transferDate: formatDateLong,
        establishedDate: formatDateLong,
      };

      Object.entries(baseItem).forEach(([key, value]) => {
        const formattedValue = formatters[key] ? formatters[key](value) : value;
        expect(getAllByText(formattedValue)).to.exist;
      });
    });
  });
};
