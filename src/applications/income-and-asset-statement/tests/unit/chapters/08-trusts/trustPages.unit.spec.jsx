import formConfig from '../../../../config/form';
import { trustPages } from '../../../../config/chapters/08-trusts/trustPages';
import testData from '../../../e2e/fixtures/data/test-data.json';
import {
  testNumberOfFieldsByType,
  testNumberOfErrorsOnSubmitForWebComponents,
  testSelectAndValidateField,
  testSubmitsWithoutErrors,
} from '../pageTests.spec';

describe('trust list and loop pages', () => {
  const { trustPagesSummary } = trustPages;

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
      testData.data.trusts[0],
      { loggedIn: true },
    );
  });
});
