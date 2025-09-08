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

  describe('summary page (original MVP)', () => {
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

  describe('updated summary page (default)', () => {
    const { schema, uiSchema } = ownedAssetPages.ownedAssetPagesUpdatedSummary;
    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 1 },
      'updated summary page',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      [
        'va-radio[label="Are you or your dependents receiving or expecting to receive any income in the next 12 months generated by owned property or other physical assets?"]',
      ],
      'updated summary page',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'updated summary page',
      testData.data,
      { loggedIn: true },
    );
  });

  describe('updated summary page (spouse)', () => {
    const {
      schema,
      uiSchema,
    } = ownedAssetPages.ownedAssetPagesUpdatedSpouseSummary;
    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 1 },
      'updated spouse summary page',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      [
        'va-radio[label="Are you or your dependents receiving or expecting to receive any income in the next 12 months generated by owned property or other physical assets?"]',
      ],
      'updated spouse summary page',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'updated spouse summary page',
      testData.data,
      { loggedIn: true },
    );
  });

  describe('updated summary page (child)', () => {
    const {
      schema,
      uiSchema,
    } = ownedAssetPages.ownedAssetPagesUpdatedChildSummary;
    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 1 },
      'updated child summary page',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      [
        'va-radio[label="Are you receiving or expecting to receive any income in the next 12 months generated by owned property or other physical assets?"]',
      ],
      'updated child summary page',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'updated child summary page',
      testData.data,
      { loggedIn: true },
    );
  });

  describe('updated summary page (custodian)', () => {
    const {
      schema,
      uiSchema,
    } = ownedAssetPages.ownedAssetPagesUpdatedCustodianSummary;
    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 1 },
      'updated custodian summary page',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      [
        'va-radio[label="Are you or your dependents receiving or expecting to receive any income in the next 12 months generated by owned property or other physical assets?"]',
      ],
      'updated custodian summary page',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'updated custodian summary page',
      testData.data,
      { loggedIn: true },
    );
  });

  describe('asset recipient page (original MVP)', () => {
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

  describe('asset recipient page (updated default)', () => {
    const schema =
      ownedAssetPages.ownedAssetRecipientUpdatedPage.schema.properties
        .ownedAssets.items;
    const uiSchema =
      ownedAssetPages.ownedAssetRecipientUpdatedPage.uiSchema.ownedAssets.items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 1 },
      'updated recipient',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      ['va-radio[name="root_recipientRelationship"]'],
      'updated recipient',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'updated recipient',
      testData.data.ownedAssets[0],
      { loggedIn: true },
    );
    testSelectAndValidateField(
      formConfig,
      schema,
      uiSchema,
      'updated recipient',
      'root_otherRecipientRelationshipType',
    );
  });

  describe('asset recipient page (updated spouse)', () => {
    const schema =
      ownedAssetPages.ownedAssetRecipientUpdatedSpousePage.schema.properties
        .ownedAssets.items;
    const uiSchema =
      ownedAssetPages.ownedAssetRecipientUpdatedSpousePage.uiSchema.ownedAssets
        .items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 1 },
      'updated spouse recipient',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      ['va-radio[name="root_recipientRelationship"]'],
      'updated spouse recipient',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'updated spouse recipient',
      testData.data.ownedAssets[0],
      { loggedIn: true },
    );
    testSelectAndValidateField(
      formConfig,
      schema,
      uiSchema,
      'updated spouse recipient',
      'root_otherRecipientRelationshipType',
    );
  });

  describe('asset recipient page (child)', () => {
    const schema =
      ownedAssetPages.ownedAssetRecipientChildPage.schema.properties.ownedAssets
        .items;
    const uiSchema =
      ownedAssetPages.ownedAssetRecipientChildPage.uiSchema.ownedAssets.items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 1 },
      'child recipient',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      ['va-radio[name="root_recipientRelationship"]'],
      'child recipient',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'child recipient',
      testData.data.ownedAssets[0],
      { loggedIn: true },
    );
    testSelectAndValidateField(
      formConfig,
      schema,
      uiSchema,
      'child recipient',
      'root_otherRecipientRelationshipType',
    );
  });

  describe('asset recipient page (custodian)', () => {
    const schema =
      ownedAssetPages.ownedAssetRecipientCustodianPage.schema.properties
        .ownedAssets.items;
    const uiSchema =
      ownedAssetPages.ownedAssetRecipientCustodianPage.uiSchema.ownedAssets
        .items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 1 },
      'custodian recipient',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      ['va-radio[name="root_recipientRelationship"]'],
      'custodian recipient',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'custodian recipient',
      testData.data.ownedAssets[0],
      { loggedIn: true },
    );
    testSelectAndValidateField(
      formConfig,
      schema,
      uiSchema,
      'custodian recipient',
      'root_otherRecipientRelationshipType',
    );
  });

  describe('asset recipient page (parent)', () => {
    const schema =
      ownedAssetPages.ownedAssetRecipientParentPage.schema.properties
        .ownedAssets.items;
    const uiSchema =
      ownedAssetPages.ownedAssetRecipientParentPage.uiSchema.ownedAssets.items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 1 },
      'parent recipient',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      ['va-radio[name="root_recipientRelationship"]'],
      'parent recipient',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'parent recipient',
      testData.data.ownedAssets[0],
      { loggedIn: true },
    );
    testSelectAndValidateField(
      formConfig,
      schema,
      uiSchema,
      'parent recipient',
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

  describe('dynamic schema behavior for updated recipient pages', () => {
    describe('updated default recipient page', () => {
      const uiSchema =
        ownedAssetPages.ownedAssetRecipientUpdatedPage.uiSchema.ownedAssets
          .items;
      const schema =
        ownedAssetPages.ownedAssetRecipientUpdatedPage.schema.properties
          .ownedAssets.items;

      it('should require only recipientRelationship when otherRecipientRelationshipType is collapsed', () => {
        const mockSchema = {
          ...schema,
          properties: {
            ...schema.properties,
            otherRecipientRelationshipType: { 'ui:collapsed': true },
          },
        };

        const result = uiSchema['ui:options'].updateSchema({}, mockSchema);
        expect(result.required).to.deep.equal(['recipientRelationship']);
      });

      it('should require both fields when otherRecipientRelationshipType is expanded', () => {
        const mockSchema = {
          ...schema,
          properties: {
            ...schema.properties,
            otherRecipientRelationshipType: { 'ui:collapsed': false },
          },
        };

        const result = uiSchema['ui:options'].updateSchema({}, mockSchema);
        expect(result.required).to.deep.equal([
          'recipientRelationship',
          'otherRecipientRelationshipType',
        ]);
      });
    });

    describe('updated spouse recipient page', () => {
      const uiSchema =
        ownedAssetPages.ownedAssetRecipientUpdatedSpousePage.uiSchema
          .ownedAssets.items;
      const schema =
        ownedAssetPages.ownedAssetRecipientUpdatedSpousePage.schema.properties
          .ownedAssets.items;

      it('should require only recipientRelationship when otherRecipientRelationshipType is collapsed', () => {
        const mockSchema = {
          ...schema,
          properties: {
            ...schema.properties,
            otherRecipientRelationshipType: { 'ui:collapsed': true },
          },
        };

        const result = uiSchema['ui:options'].updateSchema({}, mockSchema);
        expect(result.required).to.deep.equal(['recipientRelationship']);
      });

      it('should require both fields when otherRecipientRelationshipType is expanded', () => {
        const mockSchema = {
          ...schema,
          properties: {
            ...schema.properties,
            otherRecipientRelationshipType: { 'ui:collapsed': false },
          },
        };

        const result = uiSchema['ui:options'].updateSchema({}, mockSchema);
        expect(result.required).to.deep.equal([
          'recipientRelationship',
          'otherRecipientRelationshipType',
        ]);
      });
    });
  });
});
