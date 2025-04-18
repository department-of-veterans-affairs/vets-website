import { expect } from 'chai';
import formConfig from '../../../../config/form';
import {
  discontinuedIncomePages,
  options,
} from '../../../../config/chapters/11-discontinued-incomes/discontinuedIncomePages';
import { relationshipLabels } from '../../../../labels';

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
    it('should return text', () => {
      expect(options.text.getItemName()).to.equal('Discontinued income');
    });
  });

  describe('text cardDescription function', () => {
    /* eslint-disable no-unused-vars */
    const {
      payer,
      incomeFrequency,
      incomeLastReceivedDate,
      ...baseItem
    } = testData.data.discontinuedIncomes[0];
    /* eslint-enable no-unused-vars */
    testOptionsTextCardDescription(options, baseItem, relationshipLabels);
  });

  describe('text cardDescription function with zero values', () => {
    /* eslint-disable no-unused-vars */
    const {
      payer,
      incomeFrequency,
      incomeLastReceivedDate,
      ...baseItem
    } = testDataZeroes.data.discontinuedIncomes[0];
    /* eslint-enable no-unused-vars */
    testOptionsTextCardDescription(options, baseItem, relationshipLabels);
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
    testNumberOfErrorsOnSubmitForWebComponents(
      formConfig,
      schema,
      uiSchema,
      1,
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
      { 'va-text-input': 1 },
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
      {
        recipientName: 'Jane Doe',
      },
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
    testNumberOfErrorsOnSubmitForWebComponents(
      formConfig,
      schema,
      uiSchema,
      1,
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
    testNumberOfErrorsOnSubmitForWebComponents(
      formConfig,
      schema,
      uiSchema,
      1,
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
    testNumberOfErrorsOnSubmitForWebComponents(
      formConfig,
      schema,
      uiSchema,
      1,
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
    testNumberOfErrorsOnSubmitForWebComponents(
      formConfig,
      schema,
      uiSchema,
      1,
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
