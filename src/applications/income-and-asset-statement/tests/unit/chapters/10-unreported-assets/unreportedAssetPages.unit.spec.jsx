import { expect } from 'chai';
import formConfig from '../../../../config/form';
import {
  unreportedAssetPages,
  options,
} from '../../../../config/chapters/09-unreported-assets/unreportedAssetPages';
import {
  spouseRelationshipLabels,
  custodianRelationshipLabels,
  parentRelationshipLabels,
} from '../../../../labels';
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
  testSubmitsWithoutErrors,
} from '../pageTests.spec';

describe('unreported asset list and loop pages', () => {
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

  describe('summary pages', () => {
    describe('veteran summary page', () => {
      const {
        schema,
        uiSchema,
      } = unreportedAssetPages.unreportedAssetPagesVeteranSummary;
      const formData = { ...testData.data, claimantType: 'VETERAN' };

      it('should display when claimantType is not SPOUSE/CHILD/CUSTODIAN/PARENT', () => {
        const {
          depends,
        } = unreportedAssetPages.unreportedAssetPagesVeteranSummary;
        expect(depends(formData)).to.be.true;
      });

      testNumberOfFieldsByType(
        formConfig,
        schema,
        uiSchema,
        { 'va-radio': 1 },
        'summary page',
      );

      testSubmitsWithoutErrors(
        formConfig,
        schema,
        uiSchema,
        'summary page',
        formData,
        { loggedIn: true },
      );
    });

    describe('spouse summary page', () => {
      const {
        schema,
        uiSchema,
      } = unreportedAssetPages.unreportedAssetPagesSpouseSummary;
      const formData = { ...testData.data, claimantType: 'SPOUSE' };

      it('should display when claimantType is SPOUSE', () => {
        const {
          depends,
        } = unreportedAssetPages.unreportedAssetPagesSpouseSummary;
        expect(depends(formData)).to.be.true;
      });

      it('should have modified hint text for spouse', () => {
        expect(
          uiSchema['view:isAddingUnreportedAssets'][
            'ui:options'
          ].updateUiSchema()['ui:options'].hint,
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
      } = unreportedAssetPages.unreportedAssetPagesChildSummary;
      const formData = { ...testData.data, claimantType: 'CHILD' };

      it('should display when claimantType is CHILD', () => {
        const {
          depends,
        } = unreportedAssetPages.unreportedAssetPagesChildSummary;
        expect(depends(formData)).to.be.true;
      });

      it('should have modified title text for child', () => {
        expect(uiSchema['view:isAddingUnreportedAssets']['ui:title']).to.equal(
          'Do you have any assets you haven’t already reported?',
        );
      });

      it('should have no hint text for child', () => {
        expect(uiSchema['view:isAddingUnreportedAssets']['ui:options'].hint).to
          .be.undefined;
      });

      it('should have correct option labels', () => {
        const { labels } = uiSchema['view:isAddingUnreportedAssets'][
          'ui:options'
        ].updateUiSchema()['ui:options'];
        expect(labels.Y).to.equal('Yes, I have an asset to report');
        expect(labels.N).to.equal('No, I don’t have an asset to report');
      });

      it('should have correct labelHeaderLevel configuration', () => {
        const { labelHeaderLevel } = uiSchema['view:isAddingUnreportedAssets'][
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
      } = unreportedAssetPages.unreportedAssetPagesCustodianSummary;
      const formData = { ...testData.data, claimantType: 'CUSTODIAN' };

      it('should display when claimantType is CUSTODIAN', () => {
        const {
          depends,
        } = unreportedAssetPages.unreportedAssetPagesCustodianSummary;
        expect(depends(formData)).to.be.true;
      });

      it('should have modified hint text for custodian', () => {
        expect(
          uiSchema['view:isAddingUnreportedAssets'][
            'ui:options'
          ].updateUiSchema()['ui:options'].hint,
        ).to.include(
          'Your dependents include your spouse, including a same-sex and common-law partner and the Veteran’s children who you financially support.',
        );
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

    describe('parent summary page', () => {
      const {
        schema,
        uiSchema,
      } = unreportedAssetPages.unreportedAssetPagesParentSummary;
      const formData = { ...testData.data, claimantType: 'PARENT' };

      it('should display when claimantType is PARENT', () => {
        const {
          depends,
        } = unreportedAssetPages.unreportedAssetPagesParentSummary;
        expect(depends(formData)).to.be.true;
      });

      it('should have modified hint text for parent', () => {
        expect(
          uiSchema['view:isAddingUnreportedAssets'][
            'ui:options'
          ].updateUiSchema()['ui:options'].hint,
        ).to.include(
          'Your dependents include your spouse, including a same-sex and common-law partner.',
        );
      });

      testSubmitsWithoutErrors(
        formConfig,
        schema,
        uiSchema,
        'parent summary page',
        formData,
        { loggedIn: true },
      );
    });
  });

  describe('recipient pages', () => {
    describe('spouse recipient page', () => {
      const schema =
        unreportedAssetPages.unreportedAssetSpouseRecipientPage.schema
          .properties.unreportedAssets.items;
      const uiSchema =
        unreportedAssetPages.unreportedAssetSpouseRecipientPage.uiSchema
          .unreportedAssets.items;
      const formData = {
        ...testData.data.unreportedAssets[0],
        claimantType: 'SPOUSE',
      };

      it('should display when claimantType is SPOUSE', () => {
        const {
          depends,
        } = unreportedAssetPages.unreportedAssetSpouseRecipientPage;
        expect(depends({ claimantType: 'SPOUSE' })).to.be.true;
      });

      it('should use spouse-specific relationship labels', () => {
        const radioLabels =
          uiSchema.assetOwnerRelationship['ui:options'].labels;
        expect(radioLabels).to.equal(spouseRelationshipLabels);
      });

      it('should have correct schema properties for spouse relationships', () => {
        const relationshipKeys = schema.properties.assetOwnerRelationship.enum;
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

    describe('custodian recipient page', () => {
      const schema =
        unreportedAssetPages.unreportedAssetCustodianRecipientPage.schema
          .properties.unreportedAssets.items;
      const uiSchema =
        unreportedAssetPages.unreportedAssetCustodianRecipientPage.uiSchema
          .unreportedAssets.items;
      const formData = {
        ...testData.data.unreportedAssets[0],
        claimantType: 'CUSTODIAN',
      };

      it('should display when claimantType is CUSTODIAN', () => {
        const {
          depends,
        } = unreportedAssetPages.unreportedAssetCustodianRecipientPage;
        expect(depends({ claimantType: 'CUSTODIAN' })).to.be.true;
      });

      it('should use custodian-specific relationship labels', () => {
        const radioLabels =
          uiSchema.assetOwnerRelationship['ui:options'].labels;
        expect(radioLabels).to.equal(custodianRelationshipLabels);
      });

      it('should have correct schema properties for custodian relationships', () => {
        const relationshipKeys = schema.properties.assetOwnerRelationship.enum;
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
        unreportedAssetPages.unreportedAssetParentRecipientPage.schema
          .properties.unreportedAssets.items;
      const uiSchema =
        unreportedAssetPages.unreportedAssetParentRecipientPage.uiSchema
          .unreportedAssets.items;
      const formData = {
        ...testData.data.unreportedAssets[0],
        claimantType: 'PARENT',
      };

      it('should display when claimantType is PARENT', () => {
        const {
          depends,
        } = unreportedAssetPages.unreportedAssetParentRecipientPage;
        expect(depends({ claimantType: 'PARENT' })).to.be.true;
      });

      it('should use parent-specific relationship labels', () => {
        const radioLabels =
          uiSchema.assetOwnerRelationship['ui:options'].labels;
        expect(radioLabels).to.equal(parentRelationshipLabels);
      });

      it('should have correct schema properties for parent relationships', () => {
        const relationshipKeys = schema.properties.assetOwnerRelationship.enum;
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
