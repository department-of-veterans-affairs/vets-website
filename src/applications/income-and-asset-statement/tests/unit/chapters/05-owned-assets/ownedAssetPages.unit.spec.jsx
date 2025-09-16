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
  testComponentFieldsMarkedAsRequired,
  testSelectAndValidateField,
  testSubmitsWithoutErrors,
} from '../pageTests.spec';

describe('owned asset list and loop pages', () => {
  const { ownedAssetPagesSummary } = ownedAssetPages;

  describe('isItemIncomplete', () => {
    it('isItemIncomplete function', () => {
      const baseItem = testData.data.ownedAssets[0];
      testOptionsIsItemIncomplete(options, baseItem);
    });

    it('isItemIncomplete function tested with zeroes', () => {
      const baseItem = testDataZeroes.data.ownedAssets[0];
      testOptionsIsItemIncompleteWithZeroes(options, baseItem);
    });

    ['FARM', 'BUSINESS'].forEach(assetType => {
      it('should check stuff', () => {
        sessionStorage.setItem('showUpdatedContent', true);
        const baseItem = {
          ...testData.data.ownedAssets[0],
          assetType,
          'view:addFormQuestion': true,
          uploadedDocuments: [],
        };
        expect(options.isItemIncomplete(baseItem)).to.be.true;
      });
    });
  });

  describe('text getItemName function', () => {
    const mockFormData = {
      isLoggedIn: true,
      veteranFullName: { first: 'John', last: 'Doe' },
      otherVeteranFullName: { first: 'Alex', last: 'Smith' },
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
    it('should return "Jane Doe’s income from a business" if recipient is not Veteran and assetType is "business"', () => {
      const item = {
        recipientRelationship: 'SPOUSE',
        recipientName: { first: 'Jane', last: 'Doe' },
        assetType: 'BUSINESS',
      };
      expect(options.text.getItemName(item, 0, mockFormData)).to.equal(
        'Jane Doe’s income from a business',
      );
    });
    it('should return "Jane Doe’s income from a farm" if assetType is "farm"', () => {
      const item = {
        recipientRelationship: 'CHILD',
        recipientName: { first: 'Jane', last: 'Doe' },
        assetType: 'FARM',
      };
      expect(options.text.getItemName(item, 0, mockFormData)).to.equal(
        'Jane Doe’s income from a farm',
      );
    });
    it('should return "Jane Doe’s income from a rental property" if recipient is not Veteran and assetType is "rental property"', () => {
      const item = {
        recipientRelationship: 'PARENT',
        recipientName: { first: 'Jane', last: 'Doe' },
        assetType: 'RENTAL_PROPERTY',
      };
      expect(options.text.getItemName(item, 0, mockFormData)).to.equal(
        'Jane Doe’s income from a rental property',
      );
    });
    it('should return "Alex Smith’s income from a business" if recipient is Veteran and assetType is "business" and not logged in', () => {
      const item = {
        recipientRelationship: 'VETERAN',
        assetType: 'BUSINESS',
      };
      expect(
        options.text.getItemName(item, 0, {
          ...mockFormData,
          isLoggedIn: false,
        }),
      ).to.equal('Alex Smith’s income from a business');
    });
    it('should return "Alex Smith’s income from a farm" if recipient is Veteran and assetType is "farm" and not logged in', () => {
      const item = {
        recipientRelationship: 'VETERAN',
        assetType: 'FARM',
      };
      expect(
        options.text.getItemName(item, 0, {
          ...mockFormData,
          isLoggedIn: false,
        }),
      ).to.equal('Alex Smith’s income from a farm');
    });
    it('should return "Alex Smith’s income from a rental property" if recipient is Veteran and assetType is "rental property" and not logged in', () => {
      const item = {
        recipientRelationship: 'VETERAN',
        assetType: 'RENTAL_PROPERTY',
      };
      expect(
        options.text.getItemName(item, 0, {
          ...mockFormData,
          isLoggedIn: false,
        }),
      ).to.equal('Alex Smith’s income from a rental property');
    });
    it('should return undefined if required keys are not defined', () => {
      expect(options.text.getItemName({}, 0)).to.be.undefined;
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
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      [
        'va-radio[label="Are you or your dependents receiving or expecting to receive any income in the next 12 months generated by owned property or other physical assets?"]',
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
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      ['va-radio[name="root_recipientRelationship"]'],
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
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      [
        'va-text-input[label="Income recipient’s first name"]',
        'va-text-input[label="Income recipient’s last name"]',
      ],
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
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      [
        'va-radio[label="What is the type of the owned asset?"]',
        'va-text-input[label="Gross monthly income"]',
        'va-text-input[label="Value of your portion of the property"]',
      ],
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
