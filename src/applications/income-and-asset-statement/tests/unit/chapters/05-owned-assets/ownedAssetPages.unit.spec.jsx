import { expect } from 'chai';
import formConfig from '../../../../config/form';
import {
  ownedAssetPages,
  options,
} from '../../../../config/chapters/04-owned-assets/ownedAssetPages';
import { ownedAssetTypeLabels } from '../../../../labels';
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

describe('owned asset list and loop pages', () => {
  const { ownedAssetPagesSummary } = ownedAssetPages;

  describe('isItemIncomplete function', () => {
    const baseItem = testData.data.ownedAssets[0];
    testOptionsIsItemIncomplete(options, baseItem);
  });

  describe('isItemIncomplete function tested with zeroes', () => {
    const baseItem = testDataZeroes.data.ownedAssets[0];
    testOptionsIsItemIncompleteWithZeroes(options, baseItem);
  });

  describe('text getItemName function', () => {
    const mockFormData = {
      veteranFullName: { first: 'John', last: 'Doe' },
    };
    it('should return "John Doe’s income from a business" if recipient is Veteran and asset type is "business"', () => {
      const item = {
        recipientRelationship: 'VETERAN',
        assetType: 'BUSINESS',
      };
      expect(options.text.getItemName(item, 0, mockFormData)).to.equal(
        'John Doe’s income from a business',
      );
    });
    it('should return "John Doe’s income from a farm" if recipient is Veteran and asset type is "farm"', () => {
      const item = {
        recipientRelationship: 'VETERAN',
        assetType: 'FARM',
      };
      expect(options.text.getItemName(item, 0, mockFormData)).to.equal(
        'John Doe’s income from a farm',
      );
    });
    it('should return "John Doe’s income from a rental property" if recipient is Veteran and asset type is "rental property"', () => {
      const item = {
        recipientRelationship: 'VETERAN',
        assetType: 'RENTAL_PROPERTY',
      };
      expect(options.text.getItemName(item, 0, mockFormData)).to.equal(
        'John Doe’s income from a rental property',
      );
    });
    it('should return "Jane Doe’s income from a business" if assetType is "business"', () => {
      const item = {
        recipientRelationship: 'SPOUSE',
        recipientName: { first: 'Jane', last: 'Doe' },
        assetType: 'BUSINESS',
      };
      expect(options.text.getItemName(item)).to.equal(
        'Jane Doe’s income from a business',
      );
    });
    it('should return "Jane Doe’s income from a farm" if assetType is "farm"', () => {
      const item = {
        recipientRelationship: 'CHILD',
        recipientName: { first: 'Jane', last: 'Doe' },
        assetType: 'FARM',
      };
      expect(options.text.getItemName(item)).to.equal(
        'Jane Doe’s income from a farm',
      );
    });
    it('should return "Jane Doe’s income from a rental property" if assetType is "rental property"', () => {
      const item = {
        recipientRelationship: 'PARENT',
        recipientName: { first: 'Jane', last: 'Doe' },
        assetType: 'RENTAL_PROPERTY',
      };
      expect(options.text.getItemName(item)).to.equal(
        'Jane Doe’s income from a rental property',
      );
    });
  });

  describe('text cardDescription function', () => {
    /* eslint-disable no-unused-vars */
    const {
      recipientRelationship,
      recipientName,
      assetType,
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
      assetType,
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
      { 'va-text-input': 3 },
      'recipient',
    );
    testNumberOfErrorsOnSubmitForWebComponents(
      formConfig,
      schema,
      uiSchema,
      2,
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
      { 'va-radio': 1, 'va-text-input': 2 },
      'asset type',
    );
    testNumberOfErrorsOnSubmitForWebComponents(
      formConfig,
      schema,
      uiSchema,
      3,
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
