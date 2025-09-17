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

const setFeatureFlag = value => {
  if (typeof sessionStorage !== 'undefined') {
    if (value) {
      sessionStorage.setItem('showUpdatedContent', 'true');
    } else {
      sessionStorage.setItem('showUpdatedContent', 'false');
    }
  }
};

const clearFeatureFlag = () => {
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.removeItem('showUpdatedContent');
  }
};

const createTestItem = (baseItem, overrides) => {
  return { ...baseItem, ...overrides };
};

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
        setFeatureFlag(true);
        const baseItem = createTestItem(testData.data.ownedAssets[0], {
          assetType,
          'view:addFormQuestion': true,
          uploadedDocuments: {},
        });
        expect(options.isItemIncomplete(baseItem)).to.be.true;
        clearFeatureFlag();
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

  describe('summaryDescription alert logic', () => {
    beforeEach(() => {
      setFeatureFlag(true);
    });

    afterEach(() => {
      clearFeatureFlag();
    });

    it('should return SupplementaryFormsAlertUpdated when user declined upload', () => {
      const mockForm = {
        formData: {
          ownedAssets: [
            {
              assetType: 'FARM',
              'view:addFormQuestion': false,
            },
          ],
        },
      };

      const result = options.text.summaryDescription(mockForm);
      expect(result.type.name).to.equal('SupplementaryFormsAlertUpdated');
      expect(result.props.formData).to.equal(mockForm.formData);
    });

    it('should return SupplementaryFormsAlertUpdated when user said yes but no documents uploaded', () => {
      const mockForm = {
        formData: {
          ownedAssets: [
            {
              assetType: 'BUSINESS',
              'view:addFormQuestion': true,
              uploadedDocuments: {},
            },
          ],
        },
      };

      const result = options.text.summaryDescription(mockForm);
      expect(result.type.name).to.equal('SupplementaryFormsAlertUpdated');
    });

    it('should return null when user uploaded documents successfully', () => {
      const mockForm = {
        formData: {
          ownedAssets: [
            {
              assetType: 'FARM',
              'view:addFormQuestion': true,
              uploadedDocuments: { name: 'test.pdf', size: 1000 },
            },
          ],
        },
      };

      const result = options.text.summaryDescription(mockForm);
      expect(result).to.be.null;
    });

    it('should return null when no FARM or BUSINESS assets', () => {
      const mockForm = {
        formData: {
          ownedAssets: [
            {
              assetType: 'RENTAL_PROPERTY',
              'view:addFormQuestion': false,
            },
          ],
        },
      };

      const result = options.text.summaryDescription(mockForm);
      expect(result).to.be.null;
    });

    it('should return original SupplementaryFormsAlert when showUpdatedContent is false', () => {
      setFeatureFlag(false);

      const mockForm = {
        formData: {
          ownedAssets: [
            {
              assetType: 'FARM',
              'view:addFormQuestion': false,
            },
          ],
        },
      };

      const result = options.text.summaryDescription(mockForm);
      expect(result.type.name).to.equal('SupplementaryFormsAlert');
    });

    it('should handle multiple assets with mixed conditions', () => {
      const mockForm = {
        formData: {
          ownedAssets: [
            {
              assetType: 'RENTAL_PROPERTY', // Gets ignored
              'view:addFormQuestion': false,
            },
            {
              assetType: 'FARM', // Should trigger alert
              'view:addFormQuestion': false,
            },
            {
              assetType: 'BUSINESS', // Has uploads, should not trigger
              'view:addFormQuestion': true,
              uploadedDocuments: { name: 'test.pdf' },
            },
          ],
        },
      };

      const result = options.text.summaryDescription(mockForm);
      expect(result.type.name).to.equal('SupplementaryFormsAlertUpdated');
    });
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

  describe('additional form needed page', () => {
    const schema =
      ownedAssetPages.ownedAssetAdditionalFormNeededPage.schema.properties
        .ownedAssets.items;
    const uiSchema =
      ownedAssetPages.ownedAssetAdditionalFormNeededPage.uiSchema.ownedAssets
        .items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 1 },
      'additional form needed',
    );

    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'additional form needed',
      createTestItem(testData.data.ownedAssets[0], {
        assetType: 'FARM',
        'view:addFormQuestion': false,
      }),
      { loggedIn: true },
    );

    it('should show correct form description for FARM asset type', () => {
      expect(uiSchema['view:addFormDescription']['ui:description']).to.not.be
        .undefined;
    });
  });

  describe('document upload page', () => {
    const schema =
      ownedAssetPages.ownedAssetDocumentUploadPage.schema.properties.ownedAssets
        .items;
    const uiSchema =
      ownedAssetPages.ownedAssetDocumentUploadPage.uiSchema.ownedAssets.items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-file-input': 1 },
      'document upload',
    );

    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      ['va-file-input[label="Upload supporting form"]'],
      'document upload',
    );

    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'document upload',
      createTestItem(testData.data.ownedAssets[0], {
        assetType: 'FARM',
        'view:addFormQuestion': true,
        uploadedDocuments: {
          name: 'test-form.pdf',
          size: 1000000,
          type: 'application/pdf',
        },
      }),
      { loggedIn: true },
    );

    it('should have correct file size limit', () => {
      const fileInputOptions = uiSchema.uploadedDocuments;
      expect(fileInputOptions['ui:options'].maxFileSize).to.equal(20000000); // 20MB
    });

    it('should accept correct file types', () => {
      const fileInputOptions = uiSchema.uploadedDocuments;
      expect(fileInputOptions['ui:options'].accept).to.equal('.pdf,.jpeg,.png');
    });

    it('should have skipUpload set for localhost', () => {
      const fileInputOptions = uiSchema.uploadedDocuments;
      expect(fileInputOptions['ui:options'].skipUpload).to.not.be.undefined;
    });
  });

  describe('page dependencies', () => {
    beforeEach(() => {
      setFeatureFlag(true);
    });

    afterEach(() => {
      clearFeatureFlag();
    });

    it('additional form needed page should depend on showUpdatedContent and FARM/BUSINESS asset type', () => {
      const dependsFunction =
        ownedAssetPages.ownedAssetAdditionalFormNeededPage.depends;

      const formDataWithFarm = {
        ownedAssets: [{ assetType: 'FARM' }],
      };
      const formDataWithBusiness = {
        ownedAssets: [{ assetType: 'BUSINESS' }],
      };
      const formDataWithRental = {
        ownedAssets: [{ assetType: 'RENTAL_PROPERTY' }],
      };

      expect(dependsFunction(formDataWithFarm, 0)).to.be.true;
      expect(dependsFunction(formDataWithBusiness, 0)).to.be.true;
      expect(dependsFunction(formDataWithRental, 0)).to.be.false;
    });

    it('document upload page should depend on additional form page conditions plus user saying yes', () => {
      const dependsFunction =
        ownedAssetPages.ownedAssetDocumentUploadPage.depends;

      const formDataYes = {
        ownedAssets: [
          {
            assetType: 'FARM',
            'view:addFormQuestion': true,
          },
        ],
      };
      const formDataNo = {
        ownedAssets: [
          {
            assetType: 'FARM',
            'view:addFormQuestion': false,
          },
        ],
      };
      const formDataUndefined = {
        ownedAssets: [
          {
            assetType: 'FARM',
          },
        ],
      };

      expect(dependsFunction(formDataYes, 0)).to.be.true;
      expect(dependsFunction(formDataNo, 0)).to.be.false;
      expect(dependsFunction(formDataUndefined, 0)).to.be.false;
    });

    it('document upload page should depend on BUSINESS asset type with user saying yes', () => {
      const dependsFunction =
        ownedAssetPages.ownedAssetDocumentUploadPage.depends;

      const formDataBusiness = {
        ownedAssets: [
          {
            assetType: 'BUSINESS',
            'view:addFormQuestion': true,
          },
        ],
      };

      expect(dependsFunction(formDataBusiness, 0)).to.be.true;
    });

    it('pages should not show when showUpdatedContent is false', () => {
      setFeatureFlag(false);

      const additionalFormDepends =
        ownedAssetPages.ownedAssetAdditionalFormNeededPage.depends;
      const uploadDepends =
        ownedAssetPages.ownedAssetDocumentUploadPage.depends;

      const formData = {
        ownedAssets: [
          {
            assetType: 'FARM',
            'view:addFormQuestion': true,
          },
        ],
      };

      expect(additionalFormDepends(formData, 0)).to.be.false;
      expect(uploadDepends(formData, 0)).to.be.false;
    });
  });

  describe('cardDescription with uploaded files', () => {
    beforeEach(() => {
      setFeatureFlag(true);
    });

    afterEach(() => {
      clearFeatureFlag();
    });

    it('should show file upload info for FARM asset with uploaded documents', () => {
      const item = createTestItem(testData.data.ownedAssets[0], {
        assetType: 'FARM',
        'view:addFormQuestion': true,
        uploadedDocuments: { name: 'farm-income-form.pdf', size: 1000000 },
      });

      const result = options.text.cardDescription(item);
      expect(result.props.children).to.have.length(3);

      const resultString = JSON.stringify(result);
      expect(resultString).to.include('Form uploaded:');
      expect(resultString).to.include('farm-income-form.pdf');
    });

    it('should show file upload info for BUSINESS asset with uploaded documents', () => {
      const item = createTestItem(testData.data.ownedAssets[0], {
        assetType: 'BUSINESS',
        'view:addFormQuestion': true,
        uploadedDocuments: { name: 'business-report.pdf', size: 2000000 },
      });

      const result = options.text.cardDescription(item);
      expect(result.props.children).to.have.length(3);

      const resultString = JSON.stringify(result);
      expect(resultString).to.include('Form uploaded:');
      expect(resultString).to.include('business-report.pdf');
    });

    it('should not show file upload info when showUpdatedContent is false', () => {
      setFeatureFlag(false);

      const item = createTestItem(testData.data.ownedAssets[0], {
        assetType: 'FARM',
        'view:addFormQuestion': true,
        uploadedDocuments: { name: 'farm-form.pdf', size: 1000000 },
      });

      const result = options.text.cardDescription(item);
      expect(result.props.children).to.have.length(2);

      const resultString = JSON.stringify(result);
      expect(resultString).to.not.include('Form uploaded:');
    });

    it('should not show file upload info for non-FARM/BUSINESS assets', () => {
      const item = createTestItem(testData.data.ownedAssets[0], {
        assetType: 'RENTAL_PROPERTY',
        'view:addFormQuestion': true,
        uploadedDocuments: { name: 'some-file.pdf', size: 1000000 },
      });

      const result = options.text.cardDescription(item);
      expect(result.props.children).to.have.length(2);
    });

    it('should not show file upload info when user declined upload', () => {
      const item = createTestItem(testData.data.ownedAssets[0], {
        assetType: 'FARM',
        'view:addFormQuestion': false,
        uploadedDocuments: {},
      });

      const result = options.text.cardDescription(item);
      expect(result.props.children).to.have.length(2);
    });

    it('should not show file upload info when no documents uploaded', () => {
      const item = createTestItem(testData.data.ownedAssets[0], {
        assetType: 'BUSINESS',
        'view:addFormQuestion': true,
        uploadedDocuments: {},
      });

      const result = options.text.cardDescription(item);
      expect(result.props.children).to.have.length(2);
    });
  });

  describe('isItemIncomplete with updated logic', () => {
    beforeEach(() => {
      setFeatureFlag(true);
    });

    afterEach(() => {
      clearFeatureFlag();
    });

    it('should be incomplete when FARM asset user said yes but no documents uploaded', () => {
      const item = createTestItem(testData.data.ownedAssets[0], {
        assetType: 'FARM',
        'view:addFormQuestion': true,
        uploadedDocuments: {},
      });
      expect(options.isItemIncomplete(item)).to.be.true;
    });

    it('should be incomplete when BUSINESS asset user said yes but uploadedDocuments undefined', () => {
      const item = createTestItem(testData.data.ownedAssets[0], {
        assetType: 'BUSINESS',
        'view:addFormQuestion': true,
      });
      expect(options.isItemIncomplete(item)).to.be.true;
    });

    it('should be complete when FARM asset has uploaded documents', () => {
      const item = createTestItem(testData.data.ownedAssets[0], {
        assetType: 'FARM',
        'view:addFormQuestion': true,
        uploadedDocuments: { name: 'test.pdf', size: 1000 },
      });
      expect(options.isItemIncomplete(item)).to.be.false;
    });

    it('should be complete when user declined to upload', () => {
      const item = createTestItem(testData.data.ownedAssets[0], {
        assetType: 'BUSINESS',
        'view:addFormQuestion': false,
        uploadedDocuments: {},
      });
      expect(options.isItemIncomplete(item)).to.be.false;
    });

    it('should not check upload requirements for non-FARM/BUSINESS assets', () => {
      const item = createTestItem(testData.data.ownedAssets[0], {
        assetType: 'RENTAL_PROPERTY',
        'view:addFormQuestion': true,
        uploadedDocuments: {},
      });
      expect(options.isItemIncomplete(item)).to.be.false;
    });

    it('should not check upload requirements when showUpdatedContent is false', () => {
      setFeatureFlag(false);

      const item = createTestItem(testData.data.ownedAssets[0], {
        assetType: 'FARM',
        'view:addFormQuestion': true,
        uploadedDocuments: {},
      });
      expect(options.isItemIncomplete(item)).to.be.false;
    });
  });
});
