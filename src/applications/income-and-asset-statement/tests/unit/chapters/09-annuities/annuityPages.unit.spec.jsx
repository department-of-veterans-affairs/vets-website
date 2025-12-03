import { expect } from 'chai';
import formConfig from '../../../../config/form';
import {
  annuityPages,
  options,
} from '../../../../config/chapters/08-annuities/annuityPages';
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

describe('annuity list and loop pages', () => {
  const { annuityPagesSummary } = annuityPages;

  describe('isItemIncomplete function', () => {
    /* eslint-disable no-unused-vars */
    const {
      addedFundsDate,
      addedFundsAmount,
      annualReceivedIncome,
      surrenderValue,
      ...baseItem
    } = testData.data.annuities[0];
    /* eslint-enable no-unused-vars */
    testOptionsIsItemIncomplete(options, baseItem);
  });

  describe('isItemIncomplete function tested with zeroes', () => {
    /* eslint-disable no-unused-vars */
    const {
      addedFundsDate,
      addedFundsAmount,
      annualReceivedIncome,
      surrenderValue,
      ...baseItem
    } = testDataZeroes.data.annuities[0];
    /* eslint-enable no-unused-vars */
    testOptionsIsItemIncompleteWithZeroes(options, baseItem);
  });

  describe('text getItemName function', () => {
    it('should return "Annuity established on `establishedDate`', () => {
      const item = testData.data.trusts[0];
      expect(options.text.getItemName(item)).to.equal(
        'Annuity established on March 15, 2020',
      );
    });
  });

  describe('text cardDescription function', () => {
    /* eslint-disable no-unused-vars */
    const {
      addedFundsAfterEstablishment,
      addedFundsDate,
      addedFundsAmount,
      establishedDate,
      receivingIncomeFromAnnuity,
      annualReceivedIncome,
      canBeLiquidated,
      surrenderValue,
      ...baseItem
    } = testData.data.annuities[0];
    /* eslint-enable no-unused-vars */
    testOptionsTextCardDescription(options, baseItem);
  });

  describe('text cardDescription function with zero values', () => {
    /* eslint-disable no-unused-vars */
    const {
      addedFundsAfterEstablishment,
      addedFundsDate,
      addedFundsAmount,
      establishedDate,
      receivingIncomeFromAnnuity,
      annualReceivedIncome,
      canBeLiquidated,
      surrenderValue,
      ...baseItem
    } = testDataZeroes.data.annuities[0];
    /* eslint-enable no-unused-vars */
    testOptionsTextCardDescription(options, baseItem);
  });

  describe('summary page', () => {
    const { schema, uiSchema } = annuityPagesSummary;
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
      ['va-radio[label="Have you or your dependents established an annuity?"]'],
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

  describe('information page', () => {
    const schema =
      annuityPages.annuityInformationPage.schema.properties.annuities.items;
    const uiSchema =
      annuityPages.annuityInformationPage.uiSchema.annuities.items;

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
        'va-memorable-date[label="When was the annuity created?"]',
        'va-text-input[label="What was the fair market value of the asset when the annuity was purchased?"]',
      ],
      'information',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'information',
      testData.data.annuities[0],
      { loggedIn: true },
    );
  });

  describe('revocable page', () => {
    const schema =
      annuityPages.annuityRevocablePage.schema.properties.annuities.items;
    const uiSchema = annuityPages.annuityRevocablePage.uiSchema.annuities.items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 1 },
      'revocable',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      ['va-radio[label="What type of annuity is it?"]'],
      'revocable',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'revocable',
      testData.data.annuities[0],
      { loggedIn: true },
    );
  });

  describe('income page', () => {
    const schema =
      annuityPages.annuityIncomePage.schema.properties.annuities.items;
    const uiSchema = annuityPages.annuityIncomePage.uiSchema.annuities.items;

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
      ['va-radio[label="Do you receive income from this annuity?"]'],
      'income',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'income',
      testData.data.annuities[0],
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

  describe('liquidation page', () => {
    const schema =
      annuityPages.annuityLiquidationPage.schema.properties.annuities.items;
    const uiSchema =
      annuityPages.annuityLiquidationPage.uiSchema.annuities.items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 1 },
      'liquidation',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      ['va-radio[label="Can this annuity be liquidated?"]'],
      'liquidation',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'liquidation',
      testData.data.annuities[0],
      { loggedIn: true },
    );
    testSelectAndValidateField(
      formConfig,
      schema,
      uiSchema,
      'liquidation',
      'root_surrenderValue',
      {},
      'Y',
    );
  });

  describe('has added funds page', () => {
    const schema =
      annuityPages.annuityHasAddedFundsPage.schema.properties.annuities.items;
    const uiSchema =
      annuityPages.annuityHasAddedFundsPage.uiSchema.annuities.items;

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
        'va-radio[label="Was money added to this annuity this year or in the last 3 years?"]',
      ],
      'funds',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'funds',
      testData.data.annuities[0],
      { loggedIn: true },
    );
  });

  describe('added funds page', () => {
    const schema =
      annuityPages.annuityAddedFundsPage.schema.properties.annuities.items;
    const uiSchema =
      annuityPages.annuityAddedFundsPage.uiSchema.annuities.items;

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
      testData.data.annuities[0],
      { loggedIn: true },
    );
  });
});
