import formConfig from '../../../../config/form';
import { assetTransferPages } from '../../../../config/chapters/07-asset-transfers/assetTransferPages';
import testData from '../../../e2e/fixtures/data/test-data.json';
import {
  testNumberOfFieldsByType,
  testNumberOfErrorsOnSubmitForWebComponents,
  testSelectAndValidateField,
  testSubmitsWithoutErrors,
} from '../pageTests.spec';

describe('asset transfer list and loop pages', () => {
  const { assetTransferPagesSummary } = assetTransferPages;

  describe('summary page', () => {
    const { schema, uiSchema } = assetTransferPagesSummary;
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
      assetTransferPages.assetTransferRelationshipPage.schema.properties
        .assetTransfers.items;
    const uiSchema =
      assetTransferPages.assetTransferRelationshipPage.uiSchema.assetTransfers
        .items;

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
      testData.data.assetTransfers[0],
      { loggedIn: true },
    );
    testSelectAndValidateField(
      formConfig,
      schema,
      uiSchema,
      'relationship',
      'root_otherOriginalOwnerRelationshipType',
    );
  });

  describe('type page', () => {
    const schema =
      assetTransferPages.assetTransferTypePage.schema.properties.assetTransfers
        .items;
    const uiSchema =
      assetTransferPages.assetTransferTypePage.uiSchema.assetTransfers.items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 1, 'va-text-input': 1 },
      'type',
    );
    testNumberOfErrorsOnSubmitForWebComponents(
      formConfig,
      schema,
      uiSchema,
      2,
      'type',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'type',
      testData.data.assetTransfers[0],
      { loggedIn: true },
    );
  });

  describe('new owner page', () => {
    const schema =
      assetTransferPages.assetTransferNewOwnerPage.schema.properties
        .assetTransfers.items;
    const uiSchema =
      assetTransferPages.assetTransferNewOwnerPage.uiSchema.assetTransfers
        .items;
    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      {
        'va-radio': 1,
        'va-text-input': 4,
        'va-select': 1,
      },
      'new owner information',
    );
    testNumberOfErrorsOnSubmitForWebComponents(
      formConfig,
      schema,
      uiSchema,
      4,
      'new owner information',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'new owner information',
      testData.data.assetTransfers[0],
      { loggedIn: true },
    );
  });

  describe('transfer date page', () => {
    const schema =
      assetTransferPages.assetTransferDatePage.schema.properties.assetTransfers
        .items;
    const uiSchema =
      assetTransferPages.assetTransferDatePage.uiSchema.assetTransfers.items;
    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      {
        'va-memorable-date': 1,
      },
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
      testData.data.assetTransfers[0],
      { loggedIn: true },
    );
  });

  describe('under fair value page', () => {
    const schema =
      assetTransferPages.assetTransferUnderFairMarketValuePage.schema.properties
        .assetTransfers.items;
    const uiSchema =
      assetTransferPages.assetTransferUnderFairMarketValuePage.uiSchema
        .assetTransfers.items;
    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      {
        'va-radio': 1,
      },
      'value',
    );
    testNumberOfErrorsOnSubmitForWebComponents(
      formConfig,
      schema,
      uiSchema,
      1,
      'value',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'value',
      testData.data.assetTransfers[0],
      { loggedIn: true },
    );
  });

  describe('fair value page', () => {
    const schema =
      assetTransferPages.assetTransferMarketValuePage.schema.properties
        .assetTransfers.items;
    const uiSchema =
      assetTransferPages.assetTransferMarketValuePage.uiSchema.assetTransfers
        .items;
    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      {
        input: 3,
      },
      'value',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'value',
      testData.data.assetTransfers[0],
      { loggedIn: true },
    );
  });
});
