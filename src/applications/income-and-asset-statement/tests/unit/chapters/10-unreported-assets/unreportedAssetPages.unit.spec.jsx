import formConfig from '../../../../config/form';
import { unreportedAssetPages } from '../../../../config/chapters/10-unreported-assets/unreportedAssetPages';
import testData from '../../../e2e/fixtures/data/test-data.json';
import {
  testNumberOfFieldsByType,
  testNumberOfErrorsOnSubmitForWebComponents,
  testSelectAndValidateField,
  testSubmitsWithoutErrors,
} from '../pageTests.spec';

describe('unreported asset list and loop pages', () => {
  const { unreportedAssetPagesSummary } = unreportedAssetPages;

  describe('summary page', () => {
    const { schema, uiSchema } = unreportedAssetPagesSummary;
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
      unreportedAssetPages.unreportedAssetRelationshipPage.schema.properties
        .unreportedAssets.items;
    const uiSchema =
      unreportedAssetPages.unreportedAssetRelationshipPage.uiSchema
        .unreportedAssets.items;

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
      testData.data.unreportedAssets[0],
      { loggedIn: true },
    );
    testSelectAndValidateField(
      formConfig,
      schema,
      uiSchema,
      'relationship',
      'root_otherAssetOwnerRelationshipType',
    );
  });

  describe('type page', () => {
    const schema =
      unreportedAssetPages.unreportedAssetTypePage.schema.properties
        .unreportedAssets.items;
    const uiSchema =
      unreportedAssetPages.unreportedAssetTypePage.uiSchema.unreportedAssets
        .items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-text-input': 2, input: 1 },
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
      testData.data.unreportedAssets[0],
      { loggedIn: true },
    );
  });
});
