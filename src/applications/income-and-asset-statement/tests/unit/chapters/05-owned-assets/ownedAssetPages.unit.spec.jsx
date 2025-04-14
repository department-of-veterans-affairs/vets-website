import formConfig from '../../../../config/form';
import {
  ownedAssetPages,
  options,
} from '../../../../config/chapters/05-owned-assets/ownedAssetPages';
import { ownedAssetTypeLabels } from '../../../../labels';
import testData from '../../../e2e/fixtures/data/test-data.json';
import testDataZeroes from '../../../e2e/fixtures/data/test-data-all-zeroes.json';

import {
  testOptionsIsItemIncomplete,
  testOptionsIsItemIncompleteWithZeroes,
  testOptionsTextGetItemName,
  testOptionsTextCardDescription,
} from '../multiPageTests.spec';
import {
  testNumberOfFieldsByType,
  testNumberOfErrorsOnSubmitForWebComponents,
  testSelectAndValidateField,
  testSubmitsWithoutErrors,
} from '../pageTests.spec';

describe('owned asset list and loop pages', () => {
  const { ownedAssetPagesSummary } = ownedAssetPages;

  describe('isItemIncomplete function', () => {
    // eslint-disable-next-line no-unused-vars
    const { recipientName, ...baseItem } = testData.data.ownedAssets[0];
    testOptionsIsItemIncomplete(options, baseItem);
  });

  describe('isItemIncomplete function tested with zeroes', () => {
    // eslint-disable-next-line no-unused-vars
    const { recipientName, ...baseItem } = testDataZeroes.data.ownedAssets[0];
    testOptionsIsItemIncompleteWithZeroes(options, baseItem);
  });

  describe('text getItemName function', () => {
    testOptionsTextGetItemName(options);
  });

  describe('text cardDescription function', () => {
    /* eslint-disable no-unused-vars */
    const {
      recipientRelationship,
      recipientName,
      ...baseItem
    } = testData.data.ownedAssets[0];
    /* eslint-enable no-unused-vars */
    testOptionsTextCardDescription(options, baseItem, ownedAssetTypeLabels);
  });

  describe('text cardDescription function with zero values', () => {
    /* eslint-disable no-unused-vars */
    const {
      recipientRelationship,
      recipientName,
      ...baseItem
    } = testDataZeroes.data.ownedAssets[0];
    /* eslint-enable no-unused-vars */
    testOptionsTextCardDescription(options, baseItem, ownedAssetTypeLabels);
  });

  describe('summary page', () => {
    const { schema, uiSchema } = ownedAssetPagesSummary;
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

  describe('asset recipient page', () => {
    const schema =
      ownedAssetPages.ownedAssetRecipientPage.schema.properties.ownedAssets
        .items;
    const uiSchema =
      ownedAssetPages.ownedAssetRecipientPage.uiSchema.ownedAssets.items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 1 },
      'recipient',
    );
    testNumberOfErrorsOnSubmitForWebComponents(
      formConfig,
      schema,
      uiSchema,
      1,
      'recipient',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'recipient',
      testData.data.ownedAssets[0],
      { loggedIn: true },
    );
    testSelectAndValidateField(
      formConfig,
      schema,
      uiSchema,
      'recipient',
      'root_otherRecipientRelationshipType',
    );
  });

  describe('recipient name page', () => {
    const schema =
      ownedAssetPages.ownedAssetRecipientNamePage.schema.properties.ownedAssets
        .items;
    const uiSchema =
      ownedAssetPages.ownedAssetRecipientNamePage.uiSchema.ownedAssets.items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-text-input': 1 },
      'recipient',
    );
    testNumberOfErrorsOnSubmitForWebComponents(
      formConfig,
      schema,
      uiSchema,
      1,
      'recipient',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'recipient',
      testData.data.ownedAssets[0],
      { loggedIn: true },
    );
  });

  describe('asset type page', () => {
    const schema =
      ownedAssetPages.ownedAssetTypePage.schema.properties.ownedAssets.items;
    const uiSchema =
      ownedAssetPages.ownedAssetTypePage.uiSchema.ownedAssets.items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 1, 'va-text-input': 0, input: 2 },
      'asset type',
    );
    testNumberOfErrorsOnSubmitForWebComponents(
      formConfig,
      schema,
      uiSchema,
      1,
      'asset type',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'asset type',
      testData.data.ownedAssets[0],
      { loggedIn: true },
    );
  });
});
