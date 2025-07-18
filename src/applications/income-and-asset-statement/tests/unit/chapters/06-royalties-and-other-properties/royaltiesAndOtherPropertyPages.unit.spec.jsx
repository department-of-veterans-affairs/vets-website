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
  testComponentFieldsMarkedAsRequired,
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
      veteranFullName: { first: 'John', last: 'Doe' },
    };
    it('should return "John Doe’s income" if recipient is Veteran', () => {
      const item = {
        recipientRelationship: 'VETERAN',
      };
      expect(options.text.getItemName(item, 0, mockFormData)).to.equal(
        'John Doe’s income',
      );
    });
    it('should return "John Doe’s income', () => {
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
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      [
        'va-radio[label="Are you or your dependents receiving or expecting to receive any income and intellectual property royalties, mineral royalties, land use, or other royalties/properties?"]',
      ],
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
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      [
        'va-radio[label="What is the type of income recipient’s relationship to the Veteran?"]',
      ],
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
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      [
        'va-text-input[label="Income recipient’s first name"]',
        'va-text-input[label="Income recipient’s last name"]',
      ],
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
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      [
        'va-radio[label="How is the income generated from this asset?"]',
        'va-text-input[label="Gross monthly income"]',
        'va-text-input[label="Fair market value of this asset"]',
        'va-radio[label="Can the asset be sold?"]',
      ],
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
