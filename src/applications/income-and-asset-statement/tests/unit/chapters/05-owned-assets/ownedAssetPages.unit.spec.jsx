import { expect } from 'chai';
import sinon from 'sinon';
import formConfig from '../../../../config/form';
import {
  ownedAssetPages,
  options,
} from '../../../../config/chapters/04-owned-assets/ownedAssetPages';
import {
  ownedAssetTypeLabels,
  relationshipLabels,
  spouseRelationshipLabels,
  custodianRelationshipLabels,
  parentRelationshipLabels,
} from '../../../../labels';
import * as helpers from '../../../../helpers';
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

describe('ownedAssetPages - list loop', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    if (sandbox) {
      sandbox.restore();
    }
    sessionStorage.clear();
  });

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
      it('check isItemIncomplete', () => {
        // Stub the showUpdatedContent function instead of relying on sessionStorage
        sandbox.stub(helpers, 'showUpdatedContent').returns(true);

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

  describe('text', () => {
    describe('getItemName function', () => {
      const mockFormData = {
        isLoggedIn: true,
        veteranFullName: { first: 'John', last: 'Doe' },
        otherVeteranFullName: { first: 'Alex', last: 'Smith' },
      };

      it('should return undefined if recipientRelationship is not defined', () => {
        const item = { assetType: 'BUSINESS' };
        expect(options.text.getItemName(item, 0, mockFormData)).to.be.undefined;
      });

      it('should return undefined if assetType is not defined', () => {
        const item = { recipientRelationship: 'VETERAN' };
        expect(options.text.getItemName(item, 0, mockFormData)).to.be.undefined;
      });

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
        const item = { recipientRelationship: 'VETERAN', assetType: 'FARM' };
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
        const item = { recipientRelationship: 'VETERAN', assetType: 'FARM' };
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

    describe('summaryTitle function', () => {
      it('should show updated content', () => {
        sandbox.stub(helpers, 'showUpdatedContent').returns(true);
        expect(
          options.text.summaryTitle({
            nounPlural: 'custom',
          }),
        ).to.eql('Review property and business assets');
      });
      it('should show normal content', () => {
        sandbox.stub(helpers, 'showUpdatedContent').returns(false);
        expect(
          options.text.summaryTitle({
            nounPlural: 'custom assets',
          }),
        ).to.eql('Review your custom assets');
      });
    });

    describe('reviewAddButtonText function', () => {
      it('should show updated content', () => {
        sandbox.stub(helpers, 'showUpdatedContent').returns(true);
        expect(
          options.text.reviewAddButtonText({
            nounSingular: 'custom asset',
          }),
        ).to.eql('Add more property or business assets');
      });
      it('should show normal content', () => {
        sandbox.stub(helpers, 'showUpdatedContent').returns(false);
        expect(
          options.text.reviewAddButtonText({
            nounSingular: 'custom assets',
          }),
        ).to.eql('Add another custom assets');
      });
    });

    describe('cardDescription function', () => {
      /* eslint-disable no-unused-vars */
      const {
        recipientRelationship,
        recipientName,
        assetType,
        ...baseItem
      } = testData.data.ownedAssets[0];
      testOptionsTextCardDescription(options, baseItem, ownedAssetTypeLabels);

      ['FARM', 'BUSINESS'].forEach(at => {
        it('should show uploaded files', () => {
          sandbox.stub(helpers, 'showUpdatedContent').returns(true);
          const assetWithFiles = {
            ...testData.data.ownedAssets[0],
            assetType: at,
            'view:addFormQuestion': true,
            uploadedDocuments: [{ name: 'Test file.png' }],
          };
          expect(options.text.cardDescription(assetWithFiles)).to.not.be.null;
        });
      });

      it('should return null if `grossMonthlyIncome` or `ownedPortionValue` are not defined', () => {
        // VERIFY?
      });
    });

    describe('cardDescription function with zero values', () => {
      const {
        recipientRelationship,
        recipientName,
        assetType,
        ...baseItem
      } = testDataZeroes.data.ownedAssets[0];
      testOptionsTextCardDescription(options, baseItem, ownedAssetTypeLabels);
    });

    describe('summaryDescription', () => {
      beforeEach(() => {
        sandbox.stub(helpers, 'showUpdatedContent').returns(true);
      });

      it('should return null if showUpdatedContent: true and assetType: `OTHER`', () => {
        expect(
          options.text.summaryDescription({
            formData: {
              ownedAssets: [
                {
                  assetType: 'OTHER',
                  'view:addFormQuestion': true,
                },
              ],
            },
          }),
        ).to.be.null;
      });
      it('should SupplementaryFormsAlertUpdated if shouldShowDeclinedAlert: true', () => {
        expect(
          options.text.summaryDescription({
            formData: {
              ownedAssets: [
                { assetType: 'FARM', 'view:addFormQuestion': false },
              ],
            },
          }),
        ).to.not.be.null;
      });
      it('should SupplementaryFormsAlertUpdated if shouldShowDeclinedAlert: true', () => {
        expect(
          options.text.summaryDescription({
            formData: {
              ownedAssets: [
                {
                  assetType: 'FARM',
                  'view:addFormQuestion': true,
                  uploadedDocuments: [],
                },
              ],
            },
          }),
        ).to.not.be.null;
      });
      it('should show SupplementaryFormsAlert by default', () => {
        helpers.showUpdatedContent.returns(false);
        expect(
          options.text.summaryDescription({
            formData: {
              ownedAssets: [
                { assetType: 'OTHER', 'view:addFormQuestion': false },
              ],
            },
          }),
        ).to.not.be.null;
      });
    });

    describe('summaryDescriptionWithoutItems', () => {
      it('should return null when showUpdatedContent is false', () => {
        expect(options.text.summaryDescriptionWithoutItems).to.be.null;
      });
    });

    describe('deleteDescription', () => {
      it('should do what its supposed to', () => {
        expect(options.text.deleteDescription({})).to.not.be.null;
      });
    });
  });

  describe('summary page', () => {
    context('content: updated', () => {
      beforeEach(() => {
        sandbox.stub(helpers, 'showUpdatedContent').returns(true);
      });

      describe('default updated summary page', () => {
        const {
          schema,
          uiSchema,
        } = ownedAssetPages.ownedAssetPagesUpdatedSummary;
        const formData = { ...testData.data, claimantType: 'VETERAN' };

        it('should display when showUpdatedContent is true and claimantType is not SPOUSE/CHILD/CUSTODIAN', () => {
          const { depends } = ownedAssetPages.ownedAssetPagesUpdatedSummary;
          expect(depends(formData)).to.be.true;
        });

        testNumberOfFieldsByType(
          formConfig,
          schema,
          uiSchema,
          { 'va-radio': 1 },
          'updated summary page',
        );

        testSubmitsWithoutErrors(
          formConfig,
          schema,
          uiSchema,
          'updated summary page',
          formData,
          { loggedIn: true },
        );
      });

      describe('spouse summary page', () => {
        const {
          schema,
          uiSchema,
        } = ownedAssetPages.ownedAssetPagesUpdatedSpouseSummary;
        const formData = { ...testData.data, claimantType: 'SPOUSE' };

        it('should display when showUpdatedContent is true and claimantType is SPOUSE', () => {
          const {
            depends,
          } = ownedAssetPages.ownedAssetPagesUpdatedSpouseSummary;
          expect(depends(formData)).to.be.true;
        });

        it('should have modified hint text for spouse', () => {
          expect(
            uiSchema['view:isAddingOwnedAssets']['ui:options'].updateUiSchema()[
              'ui:options'
            ].hint,
          ).to.include(
            'Your dependents include children who you financially support',
          );
        });

        testSubmitsWithoutErrors(
          formConfig,
          schema,
          uiSchema,
          'spouse summary page',
          formData,
          { loggedIn: true },
        );
      });

      describe('child summary page', () => {
        const {
          schema,
          uiSchema,
        } = ownedAssetPages.ownedAssetPagesUpdatedChildSummary;
        const formData = { ...testData.data, claimantType: 'CHILD' };

        it('should display when showUpdatedContent is true and claimantType is CHILD', () => {
          const {
            depends,
          } = ownedAssetPages.ownedAssetPagesUpdatedChildSummary;
          expect(depends(formData)).to.be.true;
        });

        it('should have modified title text for child', () => {
          expect(uiSchema['view:isAddingOwnedAssets']['ui:title']).to.equal(
            'Are you receiving or expecting to receive any income in the next 12 months generated by owned property or other physical assets?',
          );
        });

        it('should have no hint text for child', () => {
          expect(uiSchema['view:isAddingOwnedAssets']['ui:options'].hint).to.be
            .undefined;
        });

        it('should have correct option labels', () => {
          const { labels } = uiSchema['view:isAddingOwnedAssets'][
            'ui:options'
          ].updateUiSchema()['ui:options'];
          expect(labels.Y).to.equal(
            'Yes, I have income from an owned asset to report',
          );
          expect(labels.N).to.equal(
            'No, I don’t have income from an owned asset to report',
          );
        });

        it('should have correct labelHeaderLevel configuration', () => {
          const { labelHeaderLevel } = uiSchema['view:isAddingOwnedAssets'][
            'ui:options'
          ].updateUiSchema()['ui:options'];

          expect(labelHeaderLevel).to.equal('2');
        });

        testSubmitsWithoutErrors(
          formConfig,
          schema,
          uiSchema,
          'child summary page',
          formData,
          { loggedIn: true },
        );
      });

      describe('custodian summary page', () => {
        const {
          schema,
          uiSchema,
        } = ownedAssetPages.ownedAssetPagesUpdatedCustodianSummary;
        const formData = { ...testData.data, claimantType: 'CUSTODIAN' };

        it('should display when showUpdatedContent is true and claimantType is CUSTODIAN', () => {
          const {
            depends,
          } = ownedAssetPages.ownedAssetPagesUpdatedCustodianSummary;
          expect(depends(formData)).to.be.true;
        });

        testSubmitsWithoutErrors(
          formConfig,
          schema,
          uiSchema,
          'custodian summary page',
          formData,
          { loggedIn: true },
        );
      });
    });
  });

  describe('asset recipient page', () => {
    describe('asset recipient page - content normal', () => {
      beforeEach(() => {
        sandbox.stub(helpers, 'showUpdatedContent').returns(false);
      });

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

    describe('Updated asset recipient pages', () => {
      beforeEach(() => {
        sandbox.stub(helpers, 'showUpdatedContent').returns(true);
      });

      describe('default updated recipient page', () => {
        const schema =
          ownedAssetPages.ownedAssetRecipientUpdatedPage.schema.properties
            .ownedAssets.items;
        const uiSchema =
          ownedAssetPages.ownedAssetRecipientUpdatedPage.uiSchema.ownedAssets
            .items;
        const formData = {
          ...testData.data.ownedAssets[0],
          claimantType: 'VETERAN',
        };

        it('should display when showUpdatedContent is true and claimantType is not SPOUSE/CHILD/CUSTODIAN/PARENT', () => {
          const { depends } = ownedAssetPages.ownedAssetRecipientUpdatedPage;
          expect(depends({ claimantType: 'VETERAN' })).to.be.true;
        });

        it('should have expandedContentFocus option for OTHER field', () => {
          expect(
            uiSchema.otherRecipientRelationshipType['ui:options']
              .expandedContentFocus,
          ).to.be.true;
        });

        it('should use standard relationship labels', () => {
          const radioLabels =
            uiSchema.recipientRelationship['ui:options'].labels;
          expect(radioLabels).to.equal(relationshipLabels);
        });

        it('should dynamically update schema when OTHER is selected', () => {
          const { updateSchema } = uiSchema['ui:options'];
          const mockSchema = {
            properties: {
              otherRecipientRelationshipType: { 'ui:collapsed': false },
            },
            required: ['recipientRelationship'],
          };

          const updated = updateSchema(formData, mockSchema);
          expect(updated.required).to.deep.equal([
            'recipientRelationship',
            'otherRecipientRelationshipType',
          ]);
        });

        it('should not require otherRecipientRelationshipType when collapsed', () => {
          const { updateSchema } = uiSchema['ui:options'];
          const mockSchema = {
            properties: {
              otherRecipientRelationshipType: { 'ui:collapsed': true },
            },
            required: ['recipientRelationship'],
          };

          const updated = updateSchema(formData, mockSchema);
          expect(updated.required).to.deep.equal(['recipientRelationship']);
        });

        testNumberOfFieldsByType(
          formConfig,
          schema,
          uiSchema,
          { 'va-radio': 1 },
          'updated recipient',
        );

        testSubmitsWithoutErrors(
          formConfig,
          schema,
          uiSchema,
          'updated recipient',
          formData,
          { loggedIn: true },
        );
      });

      describe('spouse recipient page', () => {
        const schema =
          ownedAssetPages.ownedAssetRecipientUpdatedSpousePage.schema.properties
            .ownedAssets.items;
        const uiSchema =
          ownedAssetPages.ownedAssetRecipientUpdatedSpousePage.uiSchema
            .ownedAssets.items;
        const formData = {
          ...testData.data.ownedAssets[0],
          claimantType: 'SPOUSE',
        };

        it('should display when showUpdatedContent is true and claimantType is SPOUSE', () => {
          const {
            depends,
          } = ownedAssetPages.ownedAssetRecipientUpdatedSpousePage;
          expect(depends({ claimantType: 'SPOUSE' })).to.be.true;
        });

        it('should use spouse-specific relationship labels', () => {
          const radioLabels =
            uiSchema.recipientRelationship['ui:options'].labels;
          expect(radioLabels).to.equal(spouseRelationshipLabels);
        });

        it('should have correct schema properties for spouse relationships', () => {
          const relationshipKeys = schema.properties.recipientRelationship.enum;
          const expectedKeys = Object.keys(spouseRelationshipLabels);
          expect(relationshipKeys).to.deep.equal(expectedKeys);
        });

        testSubmitsWithoutErrors(
          formConfig,
          schema,
          uiSchema,
          'spouse recipient',
          formData,
          { loggedIn: true },
        );
      });

      describe('child recipient page', () => {
        const schema =
          ownedAssetPages.ownedAssetRecipientUpdatedChildPage.schema.properties
            .ownedAssets.items;
        const uiSchema =
          ownedAssetPages.ownedAssetRecipientUpdatedChildPage.uiSchema
            .ownedAssets.items;
        const formData = {
          ...testData.data.ownedAssets[0],
          claimantType: 'CHILD',
        };

        it('should display when showUpdatedContent is true and claimantType is CHILD', () => {
          const {
            depends,
          } = ownedAssetPages.ownedAssetRecipientUpdatedChildPage;
          expect(depends({ claimantType: 'CHILD' })).to.be.true;
        });

        it('should use standard relationship labels for child', () => {
          const radioLabels =
            uiSchema.recipientRelationship['ui:options'].labels;
          expect(radioLabels).to.equal(relationshipLabels);
        });

        testSubmitsWithoutErrors(
          formConfig,
          schema,
          uiSchema,
          'child recipient',
          formData,
          { loggedIn: true },
        );
      });

      describe('custodian recipient page', () => {
        const schema =
          ownedAssetPages.ownedAssetRecipientUpdatedCustodianPage.schema
            .properties.ownedAssets.items;
        const uiSchema =
          ownedAssetPages.ownedAssetRecipientUpdatedCustodianPage.uiSchema
            .ownedAssets.items;
        const formData = {
          ...testData.data.ownedAssets[0],
          claimantType: 'CUSTODIAN',
        };

        it('should display when showUpdatedContent is true and claimantType is CUSTODIAN', () => {
          const {
            depends,
          } = ownedAssetPages.ownedAssetRecipientUpdatedCustodianPage;
          expect(depends({ claimantType: 'CUSTODIAN' })).to.be.true;
        });

        it('should use custodian-specific relationship labels', () => {
          const radioLabels =
            uiSchema.recipientRelationship['ui:options'].labels;
          expect(radioLabels).to.equal(custodianRelationshipLabels);
        });

        it('should have correct schema properties for custodian relationships', () => {
          const relationshipKeys = schema.properties.recipientRelationship.enum;
          const expectedKeys = Object.keys(custodianRelationshipLabels);
          expect(relationshipKeys).to.deep.equal(expectedKeys);
        });

        testSubmitsWithoutErrors(
          formConfig,
          schema,
          uiSchema,
          'custodian recipient',
          formData,
          { loggedIn: true },
        );
      });

      describe('parent recipient page', () => {
        const schema =
          ownedAssetPages.ownedAssetRecipientUpdatedParentPage.schema.properties
            .ownedAssets.items;
        const uiSchema =
          ownedAssetPages.ownedAssetRecipientUpdatedParentPage.uiSchema
            .ownedAssets.items;
        const formData = {
          ...testData.data.ownedAssets[0],
          claimantType: 'PARENT',
        };

        it('should display when showUpdatedContent is true and claimantType is PARENT', () => {
          const {
            depends,
          } = ownedAssetPages.ownedAssetRecipientUpdatedParentPage;
          expect(depends({ claimantType: 'PARENT' })).to.be.true;
        });

        it('should use parent-specific relationship labels', () => {
          const radioLabels =
            uiSchema.recipientRelationship['ui:options'].labels;
          expect(radioLabels).to.equal(parentRelationshipLabels);
        });

        it('should have correct schema properties for parent relationships', () => {
          const relationshipKeys = schema.properties.recipientRelationship.enum;
          const expectedKeys = Object.keys(parentRelationshipLabels);
          expect(relationshipKeys).to.deep.equal(expectedKeys);
        });

        testSubmitsWithoutErrors(
          formConfig,
          schema,
          uiSchema,
          'parent recipient',
          formData,
          { loggedIn: true },
        );
      });
    });
  });

  describe('recipient name page', () => {
    context('recipient name page', () => {
      const schema =
        ownedAssetPages.ownedAssetRecipientNamePage.schema.properties
          .ownedAssets.items;
      const uiSchema =
        ownedAssetPages.ownedAssetRecipientNamePage.uiSchema.ownedAssets.items;

      it('should display when recipientNameRequired returns true', () => {
        const recipientNameRequiredStub = sandbox
          .stub(helpers, 'recipientNameRequired')
          .returns(true);
        const { depends } = ownedAssetPages.ownedAssetRecipientNamePage;
        const formData = { ownedAssets: [{ recipientRelationship: 'SPOUSE' }] };

        expect(depends(formData, 0)).to.be.true;
        expect(recipientNameRequiredStub.calledWith(formData, 0, 'ownedAssets'))
          .to.be.true;
      });

      it('should not display when recipientNameRequired returns false', () => {
        const recipientNameRequiredStub = sandbox
          .stub(helpers, 'recipientNameRequired')
          .returns(false);
        const { depends } = ownedAssetPages.ownedAssetRecipientNamePage;
        const formData = {
          ownedAssets: [{ recipientRelationship: 'VETERAN' }],
        };

        expect(depends(formData, 0)).to.be.false;
      });

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
  });

  describe('asset type page', () => {
    context('content: normal', () => {
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

  describe('page depends', () => {
    context('content: updated', () => {
      beforeEach(() => {
        sandbox.stub(helpers, 'showUpdatedContent').returns(true);
      });

      it('should handle all claimant types correctly for summary pages', () => {
        const testCases = [
          {
            claimantType: 'VETERAN',
            expectedPage: 'ownedAssetPagesUpdatedSummary',
          },
          {
            claimantType: 'SPOUSE',
            expectedPage: 'ownedAssetPagesUpdatedSpouseSummary',
          },
          {
            claimantType: 'CHILD',
            expectedPage: 'ownedAssetPagesUpdatedChildSummary',
          },
          {
            claimantType: 'CUSTODIAN',
            expectedPage: 'ownedAssetPagesUpdatedCustodianSummary',
          },
          {
            claimantType: undefined,
            expectedPage: 'ownedAssetPagesUpdatedSummary',
          },
        ];

        testCases.forEach(({ claimantType, expectedPage }) => {
          const formData = { claimantType };

          Object.keys(ownedAssetPages).forEach(pageName => {
            const page = ownedAssetPages[pageName];
            if (page.depends && pageName.includes('Summary')) {
              const shouldShow = page.depends(formData);
              if (pageName === expectedPage) {
                expect(shouldShow).to.be.true;
              } else if (pageName !== 'ownedAssetPagesSummary') {
                expect(shouldShow).to.be.false;
              }
            }
          });
        });
      });

      it('should handle all claimant types correctly for recipient pages', () => {
        const testCases = [
          {
            claimantType: 'VETERAN',
            expectedPage: 'ownedAssetRecipientUpdatedPage',
          },
          {
            claimantType: 'SPOUSE',
            expectedPage: 'ownedAssetRecipientUpdatedSpousePage',
          },
          {
            claimantType: 'CHILD',
            expectedPage: 'ownedAssetRecipientUpdatedChildPage',
          },
          {
            claimantType: 'CUSTODIAN',
            expectedPage: 'ownedAssetRecipientUpdatedCustodianPage',
          },
          {
            claimantType: 'PARENT',
            expectedPage: 'ownedAssetRecipientUpdatedParentPage',
          },
        ];

        testCases.forEach(({ claimantType, expectedPage }) => {
          const formData = { claimantType };

          Object.keys(ownedAssetPages).forEach(pageName => {
            const page = ownedAssetPages[pageName];
            if (
              page.depends &&
              pageName.includes('Recipient') &&
              pageName.includes('Updated')
            ) {
              const shouldShow = page.depends(formData);
              if (pageName === expectedPage) {
                expect(shouldShow).to.be.true;
              } else {
                expect(shouldShow).to.be.false;
              }
            }
          });
        });
      });

      it('additionalFormNeededPage depends returns true', () => {
        const { depends } = ownedAssetPages?.ownedAssetAdditionalFormNeededPage;
        expect(depends({ ownedAssets: [{ assetType: 'FARM' }] }, 0)).to.be.true;
        expect(depends({ ownedAssets: [{ assetType: 'BUSINESS' }] }, 0)).to.be
          .true;
      });

      it('additionalFormNeededPage depends returns true', () => {
        const { depends } = ownedAssetPages?.ownedAssetDocumentUploadPage;
        const generateOwnedAssets = (assetType = 'FARM') => ({
          ownedAssets: [{ 'view:addFormQuestion': true, assetType }],
        });
        expect(depends(generateOwnedAssets(), 0)).to.be.true;
        expect(depends(generateOwnedAssets('BUSINESS'), 0)).to.be.true;
      });
    });
  });

  describe('ownedAssetDocumentUpload page', () => {
    describe('validations', () => {
      const uiSchema =
        ownedAssetPages.ownedAssetDocumentUploadPage.uiSchema.ownedAssets.items;

      it('should add an error when no file is uploaded', () => {
        const validation = uiSchema.uploadedDocuments['ui:validations'][0];
        const errors = { addError: sandbox.spy() };
        const fieldData = {};

        validation(errors, fieldData);
        expect(errors.addError.called).to.be.true;
      });

      it('should NOT add an error when file is uploaded', () => {
        const validation = uiSchema.uploadedDocuments['ui:validations'][0];
        const errors = { addError: sandbox.spy() };
        const fieldData = {
          name: 'File name.png',
        };

        validation(errors, fieldData);
        expect(errors.addError.called).to.be.false;
      });

      it('should return early if encrypted file has no confirmation code', () => {
        const validation = uiSchema.uploadedDocuments['ui:validations'][0];
        const errors = { addError: sandbox.spy() };
        const fieldData = { isEncrypted: true };

        validation(errors, fieldData);
        expect(errors.addError.called).to.be.false;
      });
    });

    describe('required', () => {
      const uiSchema =
        ownedAssetPages.ownedAssetDocumentUploadPage.uiSchema.ownedAssets.items;

      it('should be a required field', () => {
        expect(uiSchema.uploadedDocuments['ui:required']()).to.be.true;
      });
    });
  });

  describe('Helper function integration', () => {
    it('should correctly determine when otherRecipientRelationshipType is required', () => {
      const otherRequiredStub = sandbox.stub(
        helpers,
        'otherRecipientRelationshipExplanationRequired',
      );
      otherRequiredStub.returns(true);

      const formData = {
        ownedAssets: [{ recipientRelationship: 'OTHER' }],
      };
      const index = 0;

      const mvpUiSchema =
        ownedAssetPages.ownedAssetRecipientPage.uiSchema.ownedAssets.items;
      const mvpIsRequired =
        mvpUiSchema.otherRecipientRelationshipType['ui:required'];

      expect(mvpIsRequired(formData, index)).to.be.true;
      expect(otherRequiredStub.calledWith(formData, index, 'ownedAssets')).to.be
        .true;
    });
  });
});
