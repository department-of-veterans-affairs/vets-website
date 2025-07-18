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
  testNumberOfErrorsOnSubmitForWebComponents,
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
      testData.data.associatedIncomes[0],
      { loggedIn: true },
    );
  });
});
