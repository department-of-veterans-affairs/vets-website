import { expect } from 'chai';
import formConfig from '../../../../config/form';
import {
  assetTransferPages,
  options,
} from '../../../../config/chapters/06-asset-transfers/assetTransferPages';
import {
  custodianRelationshipLabels,
  parentRelationshipLabels,
  spouseRelationshipLabels,
  transferMethodLabels,
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

describe('asset transfer list and loop pages', () => {
  describe('isItemIncomplete function', () => {
    // eslint-disable-next-line no-unused-vars
    const { saleValue, ...baseItem } = testData.data.assetTransfers[0];
    testOptionsIsItemIncomplete(options, baseItem);
  });

  describe('isItemIncomplete function tested with zeroes', () => {
    // eslint-disable-next-line no-unused-vars
    const { saleValue, ...baseItem } = testDataZeroes.data.assetTransfers[0];
    testOptionsIsItemIncompleteWithZeroes(options, baseItem);
  });

  describe('text getItemName function', () => {
    it('should return "Asset sold to `newOwnerName`', () => {
      const item = testData.data.assetTransfers[0];
      expect(options.text.getItemName(item)).to.equal(
        'Asset sold to Alice Johnson',
      );
    });
  });

  describe('text cardDescription function', () => {
    /* eslint-disable no-unused-vars */
    const {
      originalOwnerRelationship,
      transferMethod,
      newOwnerName,
      newOwnerRelationship,
      saleReportedToIrs,
      assetTransferredUnderFairMarketValue,
      saleValue,
      ...baseItem
    } = testData.data.assetTransfers[0];
    /* eslint-enable no-unused-vars */
    testOptionsTextCardDescription(options, baseItem, transferMethodLabels);
  });

  describe('text cardDescription function with zero values', () => {
    /* eslint-disable no-unused-vars */
    const {
      originalOwnerRelationship,
      transferMethod,
      newOwnerName,
      newOwnerRelationship,
      saleReportedToIrs,
      assetTransferredUnderFairMarketValue,
      saleValue,
      ...baseItem
    } = testDataZeroes.data.assetTransfers[0];
    /* eslint-enable no-unused-vars */
    testOptionsTextCardDescription(options, baseItem, transferMethodLabels);
  });

  describe('summary pages', () => {
    describe('veteran summary page', () => {
      const {
        schema,
        uiSchema,
      } = assetTransferPages.assetTransferPagesVeteranSummary;
      const formData = { ...testData.data, claimantType: 'VETERAN' };

      it('should display when claimantType is not SPOUSE/CHILD/CUSTODIAN/PARENT', () => {
        const { depends } = assetTransferPages.assetTransferPagesVeteranSummary;
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
      } = assetTransferPages.assetTransferPagesSpouseSummary;
      const formData = { ...testData.data, claimantType: 'SPOUSE' };

      it('should display when claimantType is SPOUSE', () => {
        const { depends } = assetTransferPages.assetTransferPagesSpouseSummary;
        expect(depends(formData)).to.be.true;
      });

      it('should have modified hint text for spouse', () => {
        expect(
          uiSchema['view:isAddingAssetTransfers'][
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
      } = assetTransferPages.assetTransferPagesChildSummary;
      const formData = { ...testData.data, claimantType: 'CHILD' };

      it('should display when claimantType is CHILD', () => {
        const { depends } = assetTransferPages.assetTransferPagesChildSummary;
        expect(depends(formData)).to.be.true;
      });

      it('should have modified title text for child', () => {
        expect(uiSchema['view:isAddingAssetTransfers']['ui:title']).to.equal(
          'Did you transfer any assets this year or in the past 3 years?',
        );
      });

      it('should have no hint text for child', () => {
        expect(uiSchema['view:isAddingAssetTransfers']['ui:options'].hint).to.be
          .undefined;
      });

      it('should have correct option labels', () => {
        const { labels } = uiSchema['view:isAddingAssetTransfers'][
          'ui:options'
        ].updateUiSchema()['ui:options'];
        expect(labels.Y).to.equal('Yes, I have an asset transfer to report');
        expect(labels.N).to.equal(
          'No, I don’t have an asset transfer to report',
        );
      });

      it('should have correct labelHeaderLevel configuration', () => {
        const { labelHeaderLevel } = uiSchema['view:isAddingAssetTransfers'][
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
      } = assetTransferPages.assetTransferPagesCustodianSummary;
      const formData = { ...testData.data, claimantType: 'CUSTODIAN' };

      it('should display when claimantType is CUSTODIAN', () => {
        const {
          depends,
        } = assetTransferPages.assetTransferPagesCustodianSummary;
        expect(depends(formData)).to.be.true;
      });

      it('should have modified hint text for custodian', () => {
        expect(
          uiSchema['view:isAddingAssetTransfers'][
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
      } = assetTransferPages.assetTransferPagesParentSummary;
      const formData = { ...testData.data, claimantType: 'PARENT' };

      it('should display when claimantType is PARENT', () => {
        const { depends } = assetTransferPages.assetTransferPagesParentSummary;
        expect(depends(formData)).to.be.true;
      });

      it('should have modified hint text for parent', () => {
        expect(
          uiSchema['view:isAddingAssetTransfers'][
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
        assetTransferPages.assetTransferSpouseRecipientPage.schema.properties
          .assetTransfers.items;
      const uiSchema =
        assetTransferPages.assetTransferSpouseRecipientPage.uiSchema
          .assetTransfers.items;
      const formData = {
        ...testData.data.assetTransfers[0],
        claimantType: 'SPOUSE',
      };

      it('should display when claimantType is SPOUSE', () => {
        const { depends } = assetTransferPages.assetTransferSpouseRecipientPage;
        expect(depends({ claimantType: 'SPOUSE' })).to.be.true;
      });

      it('should use spouse-specific relationship labels', () => {
        const radioLabels =
          uiSchema.originalOwnerRelationship['ui:options'].labels;
        expect(radioLabels).to.equal(spouseRelationshipLabels);
      });

      it('should have correct schema properties for spouse relationships', () => {
        const relationshipKeys =
          schema.properties.originalOwnerRelationship.enum;
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
        assetTransferPages.assetTransferCustodianRecipientPage.schema.properties
          .assetTransfers.items;
      const uiSchema =
        assetTransferPages.assetTransferCustodianRecipientPage.uiSchema
          .assetTransfers.items;
      const formData = {
        ...testData.data.assetTransfers[0],
        claimantType: 'CUSTODIAN',
      };

      it('should display when claimantType is CUSTODIAN', () => {
        const {
          depends,
        } = assetTransferPages.assetTransferCustodianRecipientPage;
        expect(depends({ claimantType: 'CUSTODIAN' })).to.be.true;
      });

      it('should use custodian-specific relationship labels', () => {
        const radioLabels =
          uiSchema.originalOwnerRelationship['ui:options'].labels;
        expect(radioLabels).to.equal(custodianRelationshipLabels);
      });

      it('should have correct schema properties for custodian relationships', () => {
        const relationshipKeys =
          schema.properties.originalOwnerRelationship.enum;
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
        assetTransferPages.assetTransferParentRecipientPage.schema.properties
          .assetTransfers.items;
      const uiSchema =
        assetTransferPages.assetTransferParentRecipientPage.uiSchema
          .assetTransfers.items;
      const formData = {
        ...testData.data.assetTransfers[0],
        claimantType: 'PARENT',
      };

      it('should display when claimantType is PARENT', () => {
        const { depends } = assetTransferPages.assetTransferParentRecipientPage;
        expect(depends({ claimantType: 'PARENT' })).to.be.true;
      });

      it('should use parent-specific relationship labels', () => {
        const radioLabels =
          uiSchema.originalOwnerRelationship['ui:options'].labels;
        expect(radioLabels).to.equal(parentRelationshipLabels);
      });

      it('should have correct schema properties for parent relationships', () => {
        const relationshipKeys =
          schema.properties.originalOwnerRelationship.enum;
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

  describe('information page', () => {
    const schema =
      assetTransferPages.assetTransferInformationPage.schema.properties
        .assetTransfers.items;
    const uiSchema =
      assetTransferPages.assetTransferInformationPage.uiSchema.assetTransfers
        .items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-text-input': 1, 'va-memorable-date': 1 },
      'type',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      ['va-text-input[label="What asset was transferred?"]'],
      ['va-memorable-date[label="When was the asset transferred?"]'],
      'type',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'type',
      testData.data.assetTransfers[0],
      { loggedIn: true },
    );
  });

  describe('new owner page', () => {
    const schema =
      assetTransferPages.assetTransferNewOwnerPage.schema.properties
        .assetTransfers.items;
    const uiSchema =
      assetTransferPages.assetTransferNewOwnerPage.uiSchema.assetTransfers
        .items;
    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      {
        'va-text-input': 4,
      },
      'new owner information',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      [
        'va-text-input[label="First or given name"]',
        'va-text-input[label="Last or family name"]',
        'va-text-input[label="What’s their relationship to the original asset owner?"]',
      ],
      'new owner information',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'new owner information',
      testData.data.assetTransfers[0],
      { loggedIn: true },
    );
  });

  describe('transfer method page', () => {
    const schema =
      assetTransferPages.assetTransferMethodPage.schema.properties
        .assetTransfers.items;
    const uiSchema =
      assetTransferPages.assetTransferMethodPage.uiSchema.assetTransfers.items;
    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      {
        'va-radio': 1,
      },
      'value',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      ['va-radio[label="How was this asset transferred?"]'],
      'value',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'value',
      testData.data.assetTransfers[0],
      { loggedIn: true },
    );
  });

  describe('fair value page', () => {
    const schema =
      assetTransferPages.assetTransferMarketValuePage.schema.properties
        .assetTransfers.items;
    const uiSchema =
      assetTransferPages.assetTransferMarketValuePage.uiSchema.assetTransfers
        .items;
    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      {
        'va-radio': 2,
        'va-text-input': 3,
      },
      'value',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'value',
      testData.data.assetTransfers[0],
      { loggedIn: true },
    );
  });
});
