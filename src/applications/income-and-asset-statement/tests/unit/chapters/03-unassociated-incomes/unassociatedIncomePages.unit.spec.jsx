import formConfig from '../../../../config/form';
import {
  unassociatedIncomePages,
  options,
} from '../../../../config/chapters/02-unassociated-incomes/unassociatedIncomePages';
import { incomeTypeLabels } from '../../../../labels';

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

describe('unassociated income list and loop pages', () => {
  const { unassociatedIncomePagesSummary } = unassociatedIncomePages;

  describe('isItemIncomplete function', () => {
    const baseItem = testData.data.unassociatedIncomes[0];
    testOptionsIsItemIncomplete(options, baseItem);
  });

  describe('isItemIncomplete function tested with zeroes', () => {
    const baseItem = testDataZeroes.data.unassociatedIncomes[0];
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
      payer,
      ...baseItem
    } = testData.data.unassociatedIncomes[0];
    /* eslint-enable no-unused-vars */
    testOptionsTextCardDescription(options, baseItem, incomeTypeLabels);
  });

  describe('text cardDescription function with zero values', () => {
    /* eslint-disable no-unused-vars */
    const {
      recipientRelationship,
      recipientName,
      payer,
      ...baseItem
    } = testData.data.unassociatedIncomes[0];
    /* eslint-enable no-unused-vars */
    testOptionsTextCardDescription(options, baseItem, incomeTypeLabels);
  });

  describe('summary page', () => {
    const { schema, uiSchema } = unassociatedIncomePagesSummary;
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
        'va-radio[label="Are you or your dependents receiving or expecting to receive any income in the next 12 months from sources not related to an account or your assets?"]',
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
      unassociatedIncomePages.unassociatedIncomeRecipientPage.schema.properties
        .unassociatedIncomes.items;
    const uiSchema =
      unassociatedIncomePages.unassociatedIncomeRecipientPage.uiSchema
        .unassociatedIncomes.items;

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
      testData.data.unassociatedIncomes[0],
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
      unassociatedIncomePages.unassociatedIncomeRecipientNamePage.schema
        .properties.unassociatedIncomes.items;
    const uiSchema =
      unassociatedIncomePages.unassociatedIncomeRecipientNamePage.uiSchema
        .unassociatedIncomes.items;

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
      testData.data.unassociatedIncomes[0],
      { loggedIn: true },
    );
  });

  describe('income type page', () => {
    const schema =
      unassociatedIncomePages.unassociatedIncomeTypePage.schema.properties
        .unassociatedIncomes.items;
    const uiSchema =
      unassociatedIncomePages.unassociatedIncomeTypePage.uiSchema
        .unassociatedIncomes.items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 1, 'va-text-input': 2 },
      'income type',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      [
        'va-radio[label="What is the type of income?"]',
        'va-text-input[label="Gross monthly income"]',
        'va-text-input[label="Income payer name"]',
      ],
      'income type',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'income type',
      testData.data.unassociatedIncomes[0],
      { loggedIn: true },
    );
  });
});
