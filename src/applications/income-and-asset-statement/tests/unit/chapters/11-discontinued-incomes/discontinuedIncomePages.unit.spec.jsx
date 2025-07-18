import formConfig from '../../../../config/form';
import {
  discontinuedIncomePages,
  options,
} from '../../../../config/chapters/10-discontinued-incomes/discontinuedIncomePages';

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
  testSubmitsWithoutErrors,
  testSelectAndValidateField,
} from '../pageTests.spec';

describe('discontinued income list and loop pages', () => {
  const { discontinuedIncomePagesSummary } = discontinuedIncomePages;

  describe('isItemIncomplete function', () => {
    const baseItem = testData.data.discontinuedIncomes[0];
    testOptionsIsItemIncomplete(options, baseItem);
  });

  describe('isItemIncomplete function tested with zeroes', () => {
    const baseItem = testDataZeroes.data.discontinuedIncomes[0];
    testOptionsIsItemIncompleteWithZeroes(options, baseItem);
  });

  describe('text getItemName function', () => {
    testOptionsTextGetItemNameRecurringIncome(options);
  });

  describe('text cardDescription function', () => {
    /* eslint-disable no-unused-vars */
    const {
      payer,
      incomeFrequency,
      incomeLastReceivedDate,
      recipientRelationship,
      recipientName,
      ...baseItem
    } = testData.data.discontinuedIncomes[0];
    /* eslint-enable no-unused-vars */
    testOptionsTextCardDescription(options, baseItem);
  });

  describe('text cardDescription function with zero values', () => {
    /* eslint-disable no-unused-vars */
    const {
      payer,
      incomeFrequency,
      incomeLastReceivedDate,
      recipientRelationship,
      recipientName,
      ...baseItem
    } = testDataZeroes.data.discontinuedIncomes[0];
    /* eslint-enable no-unused-vars */
    testOptionsTextCardDescription(options, baseItem);
  });

  describe('summary page', () => {
    const { schema, uiSchema } = discontinuedIncomePagesSummary;
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
        'va-radio[label="Did you or your dependents receive income that has stopped or is no longer being received within the last calendar year?"]',
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

  describe('relationship page', () => {
    const schema =
      discontinuedIncomePages.discontinuedIncomeRelationshipPage.schema
        .properties.discontinuedIncomes.items;
    const uiSchema =
      discontinuedIncomePages.discontinuedIncomeRelationshipPage.uiSchema
        .discontinuedIncomes.items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 1 },
      'relationship',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      [
        'va-radio[label="What is the income recipient’s relationship to the Veteran?"]',
      ],
      'relationship',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'relationship',
      testData.data.discontinuedIncomes[0],
      { loggedIn: true },
    );
    testSelectAndValidateField(
      formConfig,
      schema,
      uiSchema,
      'relationship',
      'root_otherRecipientRelationshipType',
    );
  });

  describe('recipient name page', () => {
    const schema =
      discontinuedIncomePages.discontinuedIncomeRecipientNamePage.schema
        .properties.discontinuedIncomes.items;
    const uiSchema =
      discontinuedIncomePages.discontinuedIncomeRecipientNamePage.uiSchema
        .discontinuedIncomes.items;

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
      testData.data.discontinuedIncomes[0],
      { loggedIn: true },
    );
  });

  describe('payer page', () => {
    const schema =
      discontinuedIncomePages.discontinuedIncomePayerPage.schema.properties
        .discontinuedIncomes.items;
    const uiSchema =
      discontinuedIncomePages.discontinuedIncomePayerPage.uiSchema
        .discontinuedIncomes.items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-text-input': 1 },
      'payer',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      ['va-text-input[label="Income payer name"]'],
      'payer',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'payer',
      testData.data.discontinuedIncomes[0],
      { loggedIn: true },
    );
  });

  describe('type page', () => {
    const schema =
      discontinuedIncomePages.discontinuedIncomeTypePage.schema.properties
        .discontinuedIncomes.items;
    const uiSchema =
      discontinuedIncomePages.discontinuedIncomeTypePage.uiSchema
        .discontinuedIncomes.items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-text-input': 1 },
      'type',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      ['va-text-input[label="What is the type of income received?"]'],
      'type',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'type',
      testData.data.discontinuedIncomes[0],
      { loggedIn: true },
    );
  });

  describe('frequency page', () => {
    const schema =
      discontinuedIncomePages.discontinuedIncomeFrequencyPage.schema.properties
        .discontinuedIncomes.items;
    const uiSchema =
      discontinuedIncomePages.discontinuedIncomeFrequencyPage.uiSchema
        .discontinuedIncomes.items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 1 },
      'frequency',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      ['va-radio[label="What is the frequency of the income received?"]'],
      'frequency',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'frequency',
      testData.data.discontinuedIncomes[0],
      { loggedIn: true },
    );
  });

  describe('date page', () => {
    const schema =
      discontinuedIncomePages.discontinuedIncomeDatePage.schema.properties
        .discontinuedIncomes.items;
    const uiSchema =
      discontinuedIncomePages.discontinuedIncomeDatePage.uiSchema
        .discontinuedIncomes.items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-memorable-date': 1 },
      'date',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      ['va-memorable-date[label="When was the income last paid?"]'],
      'date',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'date',
      testData.data.discontinuedIncomes[0],
      { loggedIn: true },
    );
  });

  describe('amount page', () => {
    const schema =
      discontinuedIncomePages.discontinuedIncomeAmountPage.schema.properties
        .discontinuedIncomes.items;
    const uiSchema =
      discontinuedIncomePages.discontinuedIncomeAmountPage.uiSchema
        .discontinuedIncomes.items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-text-input': 1 },
      'amount',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'amount',
      testData.data.discontinuedIncomes[0],
      { loggedIn: true },
    );
  });
});
