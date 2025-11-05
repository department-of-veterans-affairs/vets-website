import { expect } from 'chai';
import formConfig from '../../../../config/form';
import {
  unreportedAssetPages,
  options,
} from '../../../../config/chapters/09-unreported-assets/unreportedAssetPages';
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
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      [
        'va-radio[label="Do you or your dependents have any assets not already reported?"]',
      ],
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
      unreportedAssetPages.unreportedAssetNonVeteranRecipientPage.schema
        .properties.unreportedAssets.items;
    const uiSchema =
      unreportedAssetPages.unreportedAssetNonVeteranRecipientPage.uiSchema
        .unreportedAssets.items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 1 },
      'relationship',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      [
        'va-radio[label="What is the asset owner’s relationship to the Veteran?"]',
      ],
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
      unreportedAssetPages.unreportedAssetInformationPage.schema.properties
        .unreportedAssets.items;
    const uiSchema =
      unreportedAssetPages.unreportedAssetInformationPage.uiSchema
        .unreportedAssets.items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-text-input': 3 },
      'type',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      [
        'va-text-input[label="What type of asset is it?"]',
        'va-text-input[label="How much is your portion of this asset worth?"]',
        'va-text-input[label="Asset’s location?"]',
      ],
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
