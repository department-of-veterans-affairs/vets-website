import { expect } from 'chai';

import formConfig from '../../../../config/form';
import {
  trustPages,
  options,
} from '../../../../config/chapters/08-trusts/trustPages';
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
  testNumberOfErrorsOnSubmitForWebComponents,
  testSelectAndValidateField,
  testSubmitsWithoutErrors,
} from '../pageTests.spec';

describe('trust list and loop pages', () => {
  const { trustPagesSummary } = trustPages;

  describe('isItemIncomplete function', () => {
    /* eslint-disable no-unused-vars */
    const {
      addedFundsDate,
      addedFundsAmount,
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
      addedFundsDate,
      addedFundsAmount,
      receivingIncomeFromTrust,
      annualReceivedIncome,
      monthlyMedicalReimbursementAmount,
      ...baseItem
    } = testDataZeroes.data.trusts[0];
    /* eslint-enable no-unused-vars */
    testOptionsIsItemIncompleteWithZeroes(options, baseItem);
  });

  describe('text getItemName function', () => {
    it('should return "Trust established on `establishedDate`', () => {
      const item = testData.data.trusts[0];
      expect(options.text.getItemName(item)).to.equal(
        'Trust established on March 15, 2020',
      );
    });
  });

  describe('text cardDescription function', () => {
    /* eslint-disable no-unused-vars */
    const {
      establishedDate,
      addedFundsAfterEstablishment,
      addedFundsDate,
      addedFundsAmount,
      receivingIncomeFromTrust,
      annualReceivedIncome,
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
      addedFundsAfterEstablishment,
      addedFundsDate,
      addedFundsAmount,
      receivingIncomeFromTrust,
      annualReceivedIncome,
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
    testNumberOfErrorsOnSubmitForWebComponents(
      formConfig,
      schema,
      uiSchema,
      1,
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
    testNumberOfErrorsOnSubmitForWebComponents(
      formConfig,
      schema,
      uiSchema,
      2,
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
    testNumberOfErrorsOnSubmitForWebComponents(
      formConfig,
      schema,
      uiSchema,
      1,
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
    testNumberOfErrorsOnSubmitForWebComponents(
      formConfig,
      schema,
      uiSchema,
      1,
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
    testNumberOfErrorsOnSubmitForWebComponents(
      formConfig,
      schema,
      uiSchema,
      1,
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
    testNumberOfErrorsOnSubmitForWebComponents(
      formConfig,
      schema,
      uiSchema,
      1,
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
    testNumberOfErrorsOnSubmitForWebComponents(
      formConfig,
      schema,
      uiSchema,
      1,
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
    testNumberOfErrorsOnSubmitForWebComponents(
      formConfig,
      schema,
      uiSchema,
      2,
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
