import { expect } from 'chai';
import formConfig from '../../../../config/form';
import {
  incomeReceiptWaiverPages,
  options,
} from '../../../../config/chapters/11-income-receipt-waivers/incomeReceiptWaiverPages';
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
  testComponentFieldsMarkedAsRequired,
  testSelectAndValidateField,
  testSubmitsWithoutErrors,
} from '../pageTests.spec';

describe('income receipt waiver list and loop pages', () => {
  const { incomeReceiptWaiverPagesSummary } = incomeReceiptWaiverPages;

  describe('isItemIncomplete function', () => {
    /* eslint-disable no-unused-vars */
    const {
      expectedIncome,
      'view:paymentsWillResume': _,
      paymentResumeDate,
      ...baseItem
    } = testData.data.incomeReceiptWaivers[0];
    /* eslint-enable no-unused-vars */
    testOptionsIsItemIncomplete(options, baseItem);
  });

  describe('isItemIncomplete function tested with zeroes', () => {
    /* eslint-disable no-unused-vars */
    const {
      expectedIncome,
      'view:paymentsWillResume': _,
      paymentResumeDate,
      ...baseItem
    } = testDataZeroes.data.incomeReceiptWaivers[0];
    /* eslint-enable no-unused-vars */
    testOptionsIsItemIncompleteWithZeroes(options, baseItem);
  });

  describe('text getItemName function', () => {
    it('should return "`recipientName`s income receipt waiver', () => {
      const item = testData.data.incomeReceiptWaivers[0];
      expect(options.text.getItemName(item)).to.equal(
        'Jane Smith’s waived income',
      );
    });
  });

  describe('text cardDescription function', () => {
    /* eslint-disable no-unused-vars */
    const {
      expectedIncome,
      'view:paymentsWillResume': _,
      recipientRelationship,
      recipientName,
      paymentResumeDate,
      ...baseItem
    } = testData.data.incomeReceiptWaivers[0];
    /* eslint-enable no-unused-vars */
    testOptionsTextCardDescription(options, baseItem, relationshipLabels);
  });

  describe('text cardDescription function with zero values', () => {
    /* eslint-disable no-unused-vars */
    const {
      expectedIncome,
      'view:paymentsWillResume': _,
      recipientRelationship,
      recipientName,
      paymentResumeDate,
      ...baseItem
    } = testDataZeroes.data.incomeReceiptWaivers[0];
    /* eslint-enable no-unused-vars */
    testOptionsTextCardDescription(options, baseItem, relationshipLabels);
  });

  describe('summary page', () => {
    const { schema, uiSchema } = incomeReceiptWaiverPagesSummary;
    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 1 },
      'annuity summary page',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      [
        'va-radio[label="Did you or your dependents waive or expect to waive any receipt of income in the next 12 months?"]',
      ],
      'annuity summary page',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'annuity summary page',
      testData.data,
      { loggedIn: true },
    );
  });

  describe('relationship page', () => {
    const schema =
      incomeReceiptWaiverPages.incomeReceiptWaiverRelationshipPage.schema
        .properties.incomeReceiptWaivers.items;
    const uiSchema =
      incomeReceiptWaiverPages.incomeReceiptWaiverRelationshipPage.uiSchema
        .incomeReceiptWaivers.items;

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
      testData.data.incomeReceiptWaivers[0],
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
      incomeReceiptWaiverPages.incomeReceiptWaiverRecipientNamePage.schema
        .properties.incomeReceiptWaivers.items;
    const uiSchema =
      incomeReceiptWaiverPages.incomeReceiptWaiverRecipientNamePage.uiSchema
        .incomeReceiptWaivers.items;

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
      testData.data.incomeReceiptWaivers[0],
      { loggedIn: true },
    );
  });

  describe('payer page', () => {
    const schema =
      incomeReceiptWaiverPages.incomeReceiptWaiverPayerPage.schema.properties
        .incomeReceiptWaivers.items;
    const uiSchema =
      incomeReceiptWaiverPages.incomeReceiptWaiverPayerPage.uiSchema
        .incomeReceiptWaivers.items;

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
      testData.data.incomeReceiptWaivers[0],
      { loggedIn: true },
    );
  });

  describe('amount page', () => {
    const schema =
      incomeReceiptWaiverPages.incomeReceiptWaiverGrossAmountPage.schema
        .properties.incomeReceiptWaivers.items;
    const uiSchema =
      incomeReceiptWaiverPages.incomeReceiptWaiverGrossAmountPage.uiSchema
        .incomeReceiptWaivers.items;

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
      testData.data.incomeReceiptWaivers[0],
      { loggedIn: true },
    );
  });

  describe('payments page', () => {
    const schema =
      incomeReceiptWaiverPages.incomeReceiptWaiverPaymentsPage.schema.properties
        .incomeReceiptWaivers.items;
    const uiSchema =
      incomeReceiptWaiverPages.incomeReceiptWaiverPaymentsPage.uiSchema
        .incomeReceiptWaivers.items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 1 },
      'payments',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      ['va-radio[label="Do you expect the payments to resume?"]'],
      'payments',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'payments',
      testData.data.incomeReceiptWaivers[0],
      { loggedIn: true },
    );
  });

  describe('date page', () => {
    const schema =
      incomeReceiptWaiverPages.incomeReceiptWaiverDatePage.schema.properties
        .incomeReceiptWaivers.items;
    const uiSchema =
      incomeReceiptWaiverPages.incomeReceiptWaiverDatePage.uiSchema
        .incomeReceiptWaivers.items;

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
      ['va-memorable-date[label="When will the payments resume?"]'],
      'date',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'date',
      testData.data.incomeReceiptWaivers[0],
      { loggedIn: true },
    );
  });

  describe('amount page', () => {
    const schema =
      incomeReceiptWaiverPages.incomeReceiptWaiverExpectedAmountPage.schema
        .properties.incomeReceiptWaivers.items;
    const uiSchema =
      incomeReceiptWaiverPages.incomeReceiptWaiverExpectedAmountPage.uiSchema
        .incomeReceiptWaivers.items;

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
      testData.data.incomeReceiptWaivers[0],
      { loggedIn: true },
    );
  });
});
