import { expect } from 'chai';
import formConfig from '../../../../config/form';
import {
  unreportedAssetPages,
  options,
} from '../../../../config/chapters/10-unreported-assets/unreportedAssetPages';
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

describe('unreported asset list and loop pages', () => {
  const { unreportedAssetPagesSummary } = unreportedAssetPages;

  describe('isItemIncomplete function', () => {
    const baseItem = testData.data.unreportedAssets[0];
    testOptionsIsItemIncomplete(options, baseItem);
  });

  describe('isItemIncomplete function tested with zeroes', () => {
    const baseItem = testDataZeroes.data.unreportedAssets[0];
    testOptionsIsItemIncompleteWithZeroes(options, baseItem);
  });

  describe('text getItemName function', () => {
    it('should return "`assetType`"', () => {
      const item = testData.data.unreportedAssets[0];
      expect(options.text.getItemName(item)).to.equal(item.assetType);
    });
  });

  describe('text cardDescription function', () => {
    /* eslint-disable no-unused-vars */
    const {
      assetType,
      assetOwnerRelationship,
      ...baseItem
    } = testData.data.unreportedAssets[0];
    /* eslint-enable no-unused-vars */
    testOptionsTextCardDescription(options, baseItem);
  });

  describe('text cardDescription function with zero values', () => {
    /* eslint-disable no-unused-vars */
    const {
      assetType,
      assetOwnerRelationship,
      ...baseItem
    } = testDataZeroes.data.unreportedAssets[0];
    testOptionsTextCardDescription(options, baseItem);
    /* eslint-enable no-unused-vars */
  });

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
      { 'va-text-input': 3 },
      'type',
    );
    testNumberOfErrorsOnSubmitForWebComponents(
      formConfig,
      schema,
      uiSchema,
      3,
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
