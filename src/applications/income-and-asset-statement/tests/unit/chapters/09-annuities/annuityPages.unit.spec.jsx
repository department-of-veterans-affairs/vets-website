import { expect } from 'chai';
import formConfig from '../../../../config/form';
import {
  annuityPages,
  options,
} from '../../../../config/chapters/09-annuities/annuityPages';
import testData from '../../../e2e/fixtures/data/test-data.json';
import {
  testOptionsIsItemIncomplete,
  testOptionsTextCardDescription,
} from '../multiPageTests.spec';
import {
  testNumberOfFieldsByType,
  testNumberOfErrorsOnSubmitForWebComponents,
  testSelectAndValidateField,
  testSubmitsWithoutErrors,
} from '../pageTests.spec';

describe('annuity list and loop pages', () => {
  const { annuityPagesSummary } = annuityPages;

  describe('isItemIncomplete function', () => {
    // prettier-ignore
    // eslint-disable-next-line no-unused-vars
    const { addedFundsDate, addedFundsAmount, annualReceivedIncome, surrenderValue, ...baseItem } = testData.data.annuities[0];
    testOptionsIsItemIncomplete(options, baseItem);
  });

  describe('text getItemName function', () => {
    it('should return text', () => {
      expect(options.text.getItemName()).to.equal('Annuity');
    });
  });

  describe('text cardDescription function', () => {
    // prettier-ignore
    // eslint-disable-next-line no-unused-vars
    const { addedFundsAfterEstablishment, addedFundsDate, addedFundsAmount, revocable, receivingIncomeFromAnnuity, annualReceivedIncome, canBeLiquidated, surrenderValue, ...baseItem } = testData.data.annuities[0];
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
        input: 1,
      },
      'information',
    );
    testNumberOfErrorsOnSubmitForWebComponents(
      formConfig,
      schema,
      uiSchema,
      1,
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
    testNumberOfErrorsOnSubmitForWebComponents(
      formConfig,
      schema,
      uiSchema,
      1,
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
    testNumberOfErrorsOnSubmitForWebComponents(
      formConfig,
      schema,
      uiSchema,
      1,
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
      { 'va-memorable-date': 1, input: 1 },
      'added funds',
    );
    testNumberOfErrorsOnSubmitForWebComponents(
      formConfig,
      schema,
      uiSchema,
      1,
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
