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
  testNumberOfErrorsOnSubmitForWebComponents,
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
    const mockFormData = {
      isLoggedIn: true,
      veteranFullName: { first: 'John', last: 'Doe' },
      otherVeteranFullName: { first: 'Alex', last: 'Smith' },
    };
    it('should return "John Doe’s income receipt waiver" if recipient is Veteran', () => {
      const item = {
        recipientRelationship: 'VETERAN',
        recipientName: { first: 'Jane', last: 'Smith' },
      };
      expect(options.text.getItemName(item, 0, mockFormData)).to.equal(
        'John Doe’s waived income',
      );
    });
    it('should return "Alex Smith’s income receipt waiver" if recipient is Veteran and not logged in', () => {
      const item = {
        recipientRelationship: 'VETERAN',
        recipientName: { first: 'Jane', last: 'Smith' },
      };
      expect(
        options.text.getItemName(item, 0, {
          ...mockFormData,
          isLoggedIn: false,
        }),
      ).to.equal('Alex Smith’s waived income');
    });
    it('should return "Jane Smith’s income receipt waiver" if recipient is not Veteran', () => {
      const item = {
        recipientRelationship: 'SPOUSE',
        recipientName: { first: 'Jane', last: 'Smith' },
      };
      expect(options.text.getItemName(item, 0, mockFormData)).to.equal(
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
    testNumberOfErrorsOnSubmitForWebComponents(
      formConfig,
      schema,
      uiSchema,
      1,
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
    testNumberOfErrorsOnSubmitForWebComponents(
      formConfig,
      schema,
      uiSchema,
      1,
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
