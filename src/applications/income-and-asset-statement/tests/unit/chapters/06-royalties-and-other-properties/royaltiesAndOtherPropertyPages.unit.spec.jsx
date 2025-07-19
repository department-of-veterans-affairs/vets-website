import { expect } from 'chai';
import formConfig from '../../../../config/form';
import {
  royaltiesAndOtherPropertyPages,
  options,
} from '../../../../config/chapters/05-royalties-and-other-properties/royaltiesAndOtherPropertyPages';
import { formatFullNameNoSuffix } from '../../../../helpers';
import {
  generatedIncomeTypeLabels,
  relationshipLabels,
} from '../../../../labels';

import testData from '../../../e2e/fixtures/data/test-data.json';
import testDataZeroes from '../../../e2e/fixtures/data/test-data-all-zeroes.json';

import {
  testOptionsIsItemIncomplete,
  testOptionsIsItemIncompleteWithZeroes,
  testOptionsTextCardDescription,
} from '../multiPageTests.spec';
import {
  testNumberOfFieldsByType,
  testNumberOfErrorsOnSubmitForWebComponents,
  testSelectAndValidateField,
  testSubmitsWithoutErrors,
} from '../pageTests.spec';

describe('royalties list and loop pages', () => {
  const { royaltyPagesSummary } = royaltiesAndOtherPropertyPages;

  describe('isItemIncomplete function', () => {
    const baseItem = testData.data.royaltiesAndOtherProperties[0];
    testOptionsIsItemIncomplete(options, baseItem);
  });

  describe('isItemIncomplete function tested with zeroes', () => {
    const baseItem = testDataZeroes.data.royaltiesAndOtherProperties[0];
    testOptionsIsItemIncompleteWithZeroes(options, baseItem);
  });

  describe('text getItemName function', () => {
    const mockFormData = {
      isLoggedIn: true,
      veteranFullName: { first: 'John', last: 'Doe' },
      otherVeteranFullName: { first: 'Alex', last: 'Smith' },
    };
    it('should return "John Doe’s income" if recipient is Veteran', () => {
      const item = {
        recipientRelationship: 'VETERAN',
      };
      expect(options.text.getItemName(item, 0, mockFormData)).to.equal(
        'John Doe’s income',
      );
    });
    it('should return "Alex Smith’s income" if recipient is Veteran and not logged in', () => {
      const item = {
        recipientRelationship: 'VETERAN',
      };
      expect(
        options.text.getItemName(item, 0, {
          ...mockFormData,
          isLoggedIn: false,
        }),
      ).to.equal('Alex Smith’s income');
    });
    it('should return "Jane Doe’s income', () => {
      const recipientName = { first: 'Jane', middle: 'A', last: 'Doe' };
      const formattedName = formatFullNameNoSuffix(recipientName);

      Object.keys(relationshipLabels).forEach(relationshipKey => {
        if (relationshipKey !== 'VETERAN') {
          it(`should return "${formattedName}'s income" for relationship "${relationshipKey}"`, () => {
            const item = {
              recipientRelationship: relationshipKey,
              recipientName,
            };
            expect(options.text.getItemName(item)).to.equal(
              `${formattedName}’s income`,
            );
          });
        }
      });
    });
  });

  describe('text cardDescription function', () => {
    /* eslint-disable no-unused-vars */
    const {
      recipientRelationship,
      recipientName,
      canBeSold,
      ...baseItem
    } = testData.data.royaltiesAndOtherProperties[0];
    /* eslint-enable no-unused-vars */
    testOptionsTextCardDescription(
      options,
      baseItem,
      generatedIncomeTypeLabels,
    );
  });

  describe('text cardDescription function with zero values', () => {
    /* eslint-disable no-unused-vars */
    const {
      recipientRelationship,
      recipientName,
      canBeSold,
      ...baseItem
    } = testDataZeroes.data.royaltiesAndOtherProperties[0];
    /* eslint-enable no-unused-vars */
    testOptionsTextCardDescription(
      options,
      baseItem,
      generatedIncomeTypeLabels,
    );
  });

  describe('summary page', () => {
    const { schema, uiSchema } = royaltyPagesSummary;
    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 1 },
      'summary page',
    );
    testNumberOfErrorsOnSubmitForWebComponents(
      formConfig,
      schema,
      uiSchema,
      1,
      'summary page',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'summary page',
      testData.data,
      { loggedIn: true },
    );
  });

  describe('recipient page', () => {
    const schema =
      royaltiesAndOtherPropertyPages.royaltyRecipientPage.schema.properties
        .royaltiesAndOtherProperties.items;
    const uiSchema =
      royaltiesAndOtherPropertyPages.royaltyRecipientPage.uiSchema
        .royaltiesAndOtherProperties.items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 1 },
      'recipient',
    );
    testNumberOfErrorsOnSubmitForWebComponents(
      formConfig,
      schema,
      uiSchema,
      1,
      'recipient',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'recipient',
      testData.data.royaltiesAndOtherProperties[0],
      { loggedIn: true },
    );
    testSelectAndValidateField(
      formConfig,
      schema,
      uiSchema,
      'recipient',
      'root_otherRecipientRelationshipType',
    );
  });

  describe('recipient name page', () => {
    const schema =
      royaltiesAndOtherPropertyPages.royaltyRecipientNamePage.schema.properties
        .royaltiesAndOtherProperties.items;
    const uiSchema =
      royaltiesAndOtherPropertyPages.royaltyRecipientNamePage.uiSchema
        .royaltiesAndOtherProperties.items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-text-input': 3 },
      'recipient',
    );
    testNumberOfErrorsOnSubmitForWebComponents(
      formConfig,
      schema,
      uiSchema,
      2,
      'recipient',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'recipient',
      testData.data.royaltiesAndOtherProperties[0],
      { loggedIn: true },
    );
  });

  describe('income type page', () => {
    const schema =
      royaltiesAndOtherPropertyPages.generatedIncomeTypePage.schema.properties
        .royaltiesAndOtherProperties.items;
    const uiSchema =
      royaltiesAndOtherPropertyPages.generatedIncomeTypePage.uiSchema
        .royaltiesAndOtherProperties.items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 2, 'va-text-input': 2, 'va-textarea': 1 },
      'income type',
    );
    testNumberOfErrorsOnSubmitForWebComponents(
      formConfig,
      schema,
      uiSchema,
      4,
      'income type',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'income type',
      testData.data.royaltiesAndOtherProperties[0],
      { loggedIn: true },
    );
  });
});
