import { expect } from 'chai';
import formConfig from '../../../../config/form';
import {
  trustPages,
  options,
} from '../../../../config/chapters/07-trusts/trustPages';
import { trustTypeLabels } from '../../../../labels';

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

describe('trust list and loop pages', () => {
  const { trustPagesSummary } = trustPages;

  describe('isItemIncomplete function', () => {
    /* eslint-disable no-unused-vars */
    const {
      receivingIncomeFromTrust,
      annualReceivedIncome,
      monthlyMedicalReimbursementAmount,
      ...baseItem
    } = testData.data.trusts[0];
    /* eslint-enable no-unused-vars */
    testOptionsIsItemIncomplete(options, baseItem);
  });

  describe('isItemIncomplete function tested with zeroes', () => {
    /* eslint-disable no-unused-vars */
    const {
      receivingIncomeFromTrust,
      annualReceivedIncome,
      monthlyMedicalReimbursementAmount,
      ...baseItem
    } = testDataZeroes.data.trusts[0];
    /* eslint-enable no-unused-vars */
    testOptionsIsItemIncompleteWithZeroes(options, baseItem);
  });

  describe('text getItemName function', () => {
    it('should return "Trust created on `establishedDate`', () => {
      const item = testData.data.trusts[0];
      expect(options.text.getItemName(item)).to.equal(
        'Trust created on March 15, 2020',
      );
    });
  });

  describe('text cardDescription function', () => {
    /* eslint-disable no-unused-vars */
    const {
      establishedDate,
      addedFundsDate,
      trustUsedForMedicalExpenses,
      monthlyMedicalReimbursementAmount,
      trustEstablishedForVeteransChild,
      haveAuthorityOrControlOfTrust,
      ...baseItem
    } = testData.data.trusts[0];
    /* eslint-enable no-unused-vars */
    testOptionsTextCardDescription(options, baseItem, trustTypeLabels);
  });

  describe('text cardDescription function with zero values', () => {
    /* eslint-disable no-unused-vars */
    const {
      establishedDate,
      addedFundsDate,
      trustUsedForMedicalExpenses,
      monthlyMedicalReimbursementAmount,
      trustEstablishedForVeteransChild,
      haveAuthorityOrControlOfTrust,
      ...baseItem
    } = testDataZeroes.data.trusts[0];
    /* eslint-enable no-unused-vars */
    testOptionsTextCardDescription(options, baseItem, trustTypeLabels);
  });

  describe('summary page', () => {
    const { schema, uiSchema } = trustPagesSummary;
    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 1 },
      'trust summary page',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      [
        'va-radio[label="Have you or your dependents established a trust or do you or your dependents have access to a trust?"]',
      ],
      'trust summary page',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'trust summary page',
      testData.data,
      { loggedIn: true },
    );
  });

  describe('information page', () => {
    const schema =
      trustPages.trustInformationPage.schema.properties.trusts.items;
    const uiSchema = trustPages.trustInformationPage.uiSchema.trusts.items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      {
        'va-memorable-date': 1,
        'va-text-input': 1,
      },
      'information',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      [
        'va-memorable-date[label="When was the trust created?"]',
        'va-text-input[label="What was the total fair market value of the trust’s assets when created?"]',
      ],
      'information',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'information',
      testData.data.trusts[0],
      { loggedIn: true },
    );
  });

  describe('type page', () => {
    const schema = trustPages.trustTypePage.schema.properties.trusts.items;
    const uiSchema = trustPages.trustTypePage.uiSchema.trusts.items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 1 },
      'type',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      ['va-radio[label="What type of trust is it?"]'],
      'type',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'type',
      testData.data.trusts[0],
      { loggedIn: true },
    );
  });

  describe('income page', () => {
    const schema = trustPages.trustIncomePage.schema.properties.trusts.items;
    const uiSchema = trustPages.trustIncomePage.uiSchema.trusts.items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 1 },
      'income',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      ['va-radio[label="Did you receive income from this trust?"]'],
      'income',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'income',
      testData.data.trusts[0],
      { loggedIn: true },
    );
    testSelectAndValidateField(
      formConfig,
      schema,
      uiSchema,
      'income',
      'root_annualReceivedIncome',
      {},
      'Y',
    );
  });

  describe('medical expense page', () => {
    const schema =
      trustPages.trustMedicalExpensePage.schema.properties.trusts.items;
    const uiSchema = trustPages.trustMedicalExpensePage.uiSchema.trusts.items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 1 },
      'expense',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      [
        'va-radio[label="Do you use this trust to pay for or reimburse someone for your medical expenses?"]',
      ],
      'expense',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'expense',
      testData.data.trusts[0],
      { loggedIn: true },
    );
    testSelectAndValidateField(
      formConfig,
      schema,
      uiSchema,
      'expense',
      'root_monthlyMedicalReimbursementAmount',
      {},
      'Y',
    );
  });

  describe('veterans child page', () => {
    const schema =
      trustPages.trustVeteransChildPage.schema.properties.trusts.items;
    const uiSchema = trustPages.trustVeteransChildPage.uiSchema.trusts.items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 1 },
      'child',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      [
        'va-radio[label="Was this trust created for a Veteran’s child who was seriously disabled before age 18?"]',
      ],
      'child',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'child',
      testData.data.trusts[0],
      { loggedIn: true },
    );
  });

  describe('control page', () => {
    const schema = trustPages.trustControlPage.schema.properties.trusts.items;
    const uiSchema = trustPages.trustControlPage.uiSchema.trusts.items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 1 },
      'control',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      [
        'va-radio[label="Do you have any additional authority or control over this trust?"]',
      ],
      'control',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'control',
      testData.data.trusts[0],
      { loggedIn: true },
    );
  });

  describe('has added funds page', () => {
    const schema =
      trustPages.trustHasAddedFundsPage.schema.properties.trusts.items;
    const uiSchema = trustPages.trustHasAddedFundsPage.uiSchema.trusts.items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 1 },
      'funds',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      [
        'va-radio[label="Has money been added to this trust since it was created?"]',
      ],
      'funds',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'funds',
      testData.data.trusts[0],
      { loggedIn: true },
    );
  });

  describe('added funds page', () => {
    const schema =
      trustPages.trustAddedFundsPage.schema.properties.trusts.items;
    const uiSchema = trustPages.trustAddedFundsPage.uiSchema.trusts.items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-memorable-date': 1, 'va-text-input': 1 },
      'added funds',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      [
        'va-memorable-date[label="When was money added?"]',
        'va-text-input[label="How much was added?"]',
      ],
      'added funds',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'added funds',
      testData.data.trusts[0],
      { loggedIn: true },
    );
  });
});
