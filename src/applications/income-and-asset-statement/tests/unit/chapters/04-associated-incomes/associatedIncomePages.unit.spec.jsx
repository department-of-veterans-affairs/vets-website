import formConfig from '../../../../config/form';
import {
  associatedIncomePages,
  options,
} from '../../../../config/chapters/03-associated-incomes/associatedIncomePages';
import { incomeTypeEarnedLabels } from '../../../../labels';

import testData from '../../../e2e/fixtures/data/test-data.json';
import testDataZeroes from '../../../e2e/fixtures/data/test-data-all-zeroes.json';

import {
  testOptionsIsItemIncomplete,
  testOptionsIsItemIncompleteWithZeroes,
  testOptionsTextGetItemNameRecurringIncome,
  testOptionsTextCardDescription,
} from '../multiPageTests.spec';
import {
  testNumberOfFieldsByType,
  testComponentFieldsMarkedAsRequired,
  testSelectAndValidateField,
  testSubmitsWithoutErrors,
} from '../pageTests.spec';

describe('associated income list and loop pages', () => {
  const { associatedIncomePagesSummary } = associatedIncomePages;

  describe('isItemIncomplete function', () => {
    const baseItem = testData.data.associatedIncomes[0];
    testOptionsIsItemIncomplete(options, baseItem);
  });

  describe('isItemIncomplete function tested with zeroes', () => {
    const baseItem = testDataZeroes.data.associatedIncomes[0];
    testOptionsIsItemIncompleteWithZeroes(options, baseItem);
  });

  describe('text getItemName function', () => {
    testOptionsTextGetItemNameRecurringIncome(options);
  });

  describe('text cardDescription function', () => {
    /* eslint-disable no-unused-vars */
    const {
      recipientRelationship,
      recipientName,
      accountValue,
      payer,
      ...baseItem
    } = testData.data.associatedIncomes[0];
    /* eslint-enable no-unused-vars */

    testOptionsTextCardDescription(options, baseItem, incomeTypeEarnedLabels);
  });

  describe('text cardDescription function with zero values', () => {
    /* eslint-disable no-unused-vars */
    const {
      recipientRelationship,
      recipientName,
      accountValue,
      payer,
      ...baseItem
    } = testDataZeroes.data.associatedIncomes[0];
    /* eslint-enable no-unused-vars */
    testOptionsTextCardDescription(options, baseItem, incomeTypeEarnedLabels);
  });

  describe('summary page', () => {
    const { schema, uiSchema } = associatedIncomePagesSummary;
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
        'va-radio[label="Are you or your dependents receiving or expecting to receive any income in the next 12 months that is related to financial accounts?"]',
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

  describe('income recipient page', () => {
    const schema =
      associatedIncomePages.associatedIncomeRecipientPage.schema.properties
        .associatedIncomes.items;
    const uiSchema =
      associatedIncomePages.associatedIncomeRecipientPage.uiSchema
        .associatedIncomes.items;

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
      ['va-radio[name="root_recipientRelationship"]'],
      'recipient',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'recipient',
      testData.data.associatedIncomes[0],
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
      associatedIncomePages.associatedIncomeRecipientNamePage.schema.properties
        .associatedIncomes.items;
    const uiSchema =
      associatedIncomePages.associatedIncomeRecipientNamePage.uiSchema
        .associatedIncomes.items;

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
      testData.data.associatedIncomes[0],
      { loggedIn: true },
    );
  });

  describe('income type page', () => {
    const schema =
      associatedIncomePages.associatedIncomeTypePage.schema.properties
        .associatedIncomes.items;
    const uiSchema =
      associatedIncomePages.associatedIncomeTypePage.uiSchema.associatedIncomes
        .items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 1, 'va-text-input': 3 },
      'income type',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      [
        'va-radio[label="What is the type of income earned?"]',
        'va-text-input[label="Gross monthly income"]',
        'va-text-input[label="Value of account"]',
        'va-text-input[label="Income payer name"]',
      ],
      'income type',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'income type',
      testData.data.associatedIncomes[0],
      { loggedIn: true },
    );
  });
});
