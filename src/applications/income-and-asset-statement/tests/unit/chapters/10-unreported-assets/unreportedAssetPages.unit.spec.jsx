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
    it('should return text', () => {
      expect(options.text.getItemName()).to.equal('Unreported Asset');
    });
  });

  describe('text cardDescription function', () => {
    const {
      // eslint-disable-next-line no-unused-vars
      assetOwnerRelationship,
      ...baseItem
    } = testData.data.unreportedAssets[0];
    testOptionsTextCardDescription(options, baseItem);
  });

  describe('text cardDescription function with zero values', () => {
    const {
      // eslint-disable-next-line no-unused-vars
      assetOwnerRelationship,
      ...baseItem
    } = testDataZeroes.data.unreportedAssets[0];
    testOptionsTextCardDescription(options, baseItem);
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
