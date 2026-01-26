import { expect } from 'chai';
import sinon from 'sinon';
import formConfig from '../../../../config/form';
import {
  trustPages,
  options,
} from '../../../../config/chapters/07-trusts/trustPages';
import * as helpers from '../../../../helpers';
import { trustTypeLabels } from '../../../../labels';
import testData from '../../../e2e/fixtures/data/test-data.json';
import testDataZeroes from '../../../e2e/fixtures/data/test-data-all-zeroes.json';
import testDataPostMVP from '../../../e2e/fixtures/data/test-data-post-mvp.json';

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

describe('trust list and loop pages', () => {
  let showUpdatedContentStub;

  beforeEach(() => {
    showUpdatedContentStub = sinon.stub(helpers, 'showUpdatedContent');
  });

  afterEach(() => {
    if (showUpdatedContentStub && showUpdatedContentStub.restore) {
      showUpdatedContentStub.restore();
    }
  });

  const {
    trustPagesSummary,
    trustPagesVeteranSummary,
    trustPagesSpouseSummary,
    trustPagesChildSummary,
    trustPagesCustodianSummary,
    trustPagesParentSummary,
  } = trustPages;

  describe('MVP isItemIncomplete functions', () => {
    beforeEach(() => {
      showUpdatedContentStub.returns(false);
    });

    describe('isItemIncomplete function', () => {
      /* eslint-disable no-unused-vars */
      const {
        receivingIncomeFromTrust,
        annualReceivedIncome,
        monthlyMedicalReimbursementAmount,
        ...baseItem
      } = testData.data.trusts[0];
      /* eslint-enable no-unused-vars */
      testOptionsIsItemIncomplete(options, baseItem);
    });

    describe('isItemIncomplete function tested with zeroes', () => {
      /* eslint-disable no-unused-vars */
      const {
        receivingIncomeFromTrust,
        annualReceivedIncome,
        monthlyMedicalReimbursementAmount,
        ...baseItem
      } = testDataZeroes.data.trusts[0];
      /* eslint-enable no-unused-vars */
      testOptionsIsItemIncompleteWithZeroes(options, baseItem);
    });
  });

  describe('Post MVP isItemIncomplete', () => {
    it('isItemIncomplete function', () => {
      showUpdatedContentStub.returns(true);
      const baseItem = {
        ...testDataPostMVP.data.trusts[0],
        uploadedDocuments: [],
      };
      expect(options.isItemIncomplete(baseItem)).to.be.true;
    });
  });

  describe('text getItemName function', () => {
    it('should return "Trust created on `establishedDate`', () => {
      const item = testData.data.trusts[0];
      expect(options.text.getItemName(item)).to.equal(
        'Trust created on March 15, 2020',
      );
    });
  });

  describe('text cardDescription function', () => {
    /* eslint-disable no-unused-vars */
    const {
      establishedDate,
      addedFundsDate,
      trustUsedForMedicalExpenses,
      monthlyMedicalReimbursementAmount,
      trustEstablishedForVeteransChild,
      haveAuthorityOrControlOfTrust,
      ...baseItem
    } = testData.data.trusts[0];
    /* eslint-enable no-unused-vars */
    testOptionsTextCardDescription(options, baseItem, trustTypeLabels);
  });

  describe('text cardDescription function with zero values', () => {
    /* eslint-disable no-unused-vars */
    const {
      establishedDate,
      addedFundsDate,
      trustUsedForMedicalExpenses,
      monthlyMedicalReimbursementAmount,
      trustEstablishedForVeteransChild,
      haveAuthorityOrControlOfTrust,
      ...baseItem
    } = testDataZeroes.data.trusts[0];
    /* eslint-enable no-unused-vars */
    testOptionsTextCardDescription(options, baseItem, trustTypeLabels);
  });

  describe('Post MVP cardDescription functions', () => {
    beforeEach(() => {
      showUpdatedContentStub.returns(true);
    });

    it('should show "Supporting documents uploaded: No" when user declines upload', () => {
      const assetWithNoUpload = {
        ...testDataPostMVP.data.trusts[0],
        'view:addFormQuestion': false,
      };

      const result = options.text.cardDescription(assetWithNoUpload);

      const resultString = JSON.stringify(result);
      expect(resultString).to.include('Supporting documents uploaded:');
      expect(resultString).to.include('No');
    });

    it('should show filename when user uploads file', () => {
      const result = options.text.cardDescription(
        testDataPostMVP.data.trusts[0],
      );

      const resultString = JSON.stringify(result);
      expect(resultString).to.include('Supporting documents uploaded:');
      expect(resultString).to.include('file.png');
    });
  });

  describe('MVP summary page', () => {
    beforeEach(() => {
      showUpdatedContentStub.returns(false);
    });

    const { schema, uiSchema } = trustPagesSummary;
    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 1 },
      'trust summary page',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      [
        'va-radio[label="Have you or your dependents established a trust or do you or your dependents have access to a trust?"]',
      ],
      'trust summary page',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'trust summary page',
      testData.data,
      { loggedIn: true },
    );
  });

  describe('Post MVP summary pages', () => {
    beforeEach(() => {
      showUpdatedContentStub.returns(true);
    });

    describe('veteran summary page', () => {
      const { schema, uiSchema } = trustPagesVeteranSummary;
      const formData = { ...testData.data, claimantType: 'VETERAN' };

      it('should display when showUpdatedContent is true and claimantType is VETERAN', () => {
        const { depends } = trustPagesVeteranSummary;
        expect(depends(formData)).to.be.true;
      });

      it('should have modified hint text for veteran', () => {
        expect(
          uiSchema['view:isAddingTrusts']['ui:options'].updateUiSchema()[
            'ui:options'
          ].hint,
        ).to.include(
          'Your dependents include your spouse, including a same-sex and common-law partner and children who you financially support.',
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

    describe('spouse summary page', () => {
      const { schema, uiSchema } = trustPagesSpouseSummary;
      const formData = { ...testData.data, claimantType: 'SPOUSE' };

      it('should display when showUpdatedContent is true and claimantType is SPOUSE', () => {
        const { depends } = trustPagesSpouseSummary;
        expect(depends(formData)).to.be.true;
      });

      it('should have modified hint text for spouse', () => {
        expect(
          uiSchema['view:isAddingTrusts']['ui:options'].updateUiSchema()[
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
      const { schema, uiSchema } = trustPagesChildSummary;
      const formData = { ...testData.data, claimantType: 'CHILD' };

      it('should display when showUpdatedContent is true and claimantType is CHILD', () => {
        const { depends } = trustPagesChildSummary;
        expect(depends(formData)).to.be.true;
      });

      it('should have modified title text for child', () => {
        expect(uiSchema['view:isAddingTrusts']['ui:title']).to.equal(
          'Do you have access to a trust?',
        );
      });

      it('should have no hint text for child', () => {
        expect(uiSchema['view:isAddingTrusts']['ui:options'].hint).to.be
          .undefined;
      });

      it('should have correct option labels', () => {
        const { labels } = uiSchema['view:isAddingTrusts'][
          'ui:options'
        ].updateUiSchema()['ui:options'];
        expect(labels.Y).to.equal('Yes, I have a trust to report');
        expect(labels.N).to.equal('No, I don’t have a trust to report');
      });

      it('should have correct labelHeaderLevel configuration', () => {
        const { labelHeaderLevel } = uiSchema['view:isAddingTrusts'][
          'ui:options'
        ].updateUiSchema()['ui:options'];

        expect(labelHeaderLevel).to.equal('1');
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
      const { schema, uiSchema } = trustPagesCustodianSummary;
      const formData = { ...testData.data, claimantType: 'CUSTODIAN' };

      it('should display when showUpdatedContent is true and claimantType is CUSTODIAN', () => {
        const { depends } = trustPagesCustodianSummary;
        expect(depends(formData)).to.be.true;
      });

      it('should have modified hint text for custodian', () => {
        expect(
          uiSchema['view:isAddingTrusts']['ui:options'].updateUiSchema()[
            'ui:options'
          ].hint,
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
      const { schema, uiSchema } = trustPagesParentSummary;
      const formData = { ...testData.data, claimantType: 'PARENT' };

      it('should display when showUpdatedContent is true and claimantType is PARENT', () => {
        const { depends } = trustPagesParentSummary;
        expect(depends(formData)).to.be.true;
      });

      it('should have modified hint text for parent', () => {
        expect(
          uiSchema['view:isAddingTrusts']['ui:options'].updateUiSchema()[
            'ui:options'
          ].hint,
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

  describe('information page', () => {
    const schema =
      trustPages.trustInformationPage.schema.properties.trusts.items;
    const uiSchema = trustPages.trustInformationPage.uiSchema.trusts.items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      {
        'va-memorable-date': 1,
        'va-text-input': 1,
      },
      'information',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      [
        'va-memorable-date[label="When was the trust created?"]',
        'va-text-input[label="What was the total fair market value of the trust’s assets when created?"]',
      ],
      'information',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'information',
      testData.data.trusts[0],
      { loggedIn: true },
    );
  });

  describe('type page', () => {
    const schema = trustPages.trustTypePage.schema.properties.trusts.items;
    const uiSchema = trustPages.trustTypePage.uiSchema.trusts.items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 1 },
      'type',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      ['va-radio[label="What type of trust is it?"]'],
      'type',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'type',
      testData.data.trusts[0],
      { loggedIn: true },
    );
  });

  describe('income page', () => {
    const schema = trustPages.trustIncomePage.schema.properties.trusts.items;
    const uiSchema = trustPages.trustIncomePage.uiSchema.trusts.items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 1 },
      'income',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      ['va-radio[label="Did you receive income from this trust?"]'],
      'income',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'income',
      testData.data.trusts[0],
      { loggedIn: true },
    );
    testSelectAndValidateField(
      formConfig,
      schema,
      uiSchema,
      'income',
      'root_annualReceivedIncome',
      {},
      'Y',
    );
  });

  describe('medical expense page', () => {
    const schema =
      trustPages.trustMedicalExpensePage.schema.properties.trusts.items;
    const uiSchema = trustPages.trustMedicalExpensePage.uiSchema.trusts.items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 1 },
      'expense',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      [
        'va-radio[label="Do you use this trust to pay for or reimburse someone for your medical expenses?"]',
      ],
      'expense',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'expense',
      testData.data.trusts[0],
      { loggedIn: true },
    );
    testSelectAndValidateField(
      formConfig,
      schema,
      uiSchema,
      'expense',
      'root_monthlyMedicalReimbursementAmount',
      {},
      'Y',
    );
  });

  describe('veterans child page', () => {
    const schema =
      trustPages.trustVeteransChildPage.schema.properties.trusts.items;
    const uiSchema = trustPages.trustVeteransChildPage.uiSchema.trusts.items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 1 },
      'child',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      [
        'va-radio[label="Was this trust created for a Veteran’s child who was seriously disabled before age 18?"]',
      ],
      'child',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'child',
      testData.data.trusts[0],
      { loggedIn: true },
    );
  });

  describe('control page', () => {
    const schema = trustPages.trustControlPage.schema.properties.trusts.items;
    const uiSchema = trustPages.trustControlPage.uiSchema.trusts.items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 1 },
      'control',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      [
        'va-radio[label="Do you have any additional authority or control over this trust?"]',
      ],
      'control',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'control',
      testData.data.trusts[0],
      { loggedIn: true },
    );
  });

  describe('has added funds page', () => {
    const schema =
      trustPages.trustHasAddedFundsPage.schema.properties.trusts.items;
    const uiSchema = trustPages.trustHasAddedFundsPage.uiSchema.trusts.items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 1 },
      'funds',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      [
        'va-radio[label="Has money been added to this trust since it was created?"]',
      ],
      'funds',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'funds',
      testData.data.trusts[0],
      { loggedIn: true },
    );
  });

  describe('added funds page', () => {
    const schema =
      trustPages.trustAddedFundsPage.schema.properties.trusts.items;
    const uiSchema = trustPages.trustAddedFundsPage.uiSchema.trusts.items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-memorable-date': 1, 'va-text-input': 1 },
      'added funds',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      [
        'va-memorable-date[label="When was money added?"]',
        'va-text-input[label="How much was added?"]',
      ],
      'added funds',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'added funds',
      testData.data.trusts[0],
      { loggedIn: true },
    );
  });

  describe('trustDocumentUpload page', () => {
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
    describe('validations', () => {
      const uiSchema = trustPages.trustDocumentUploadPage.uiSchema.trusts.items;

      it('should add an error when no file is uploaded', () => {
        const validation = uiSchema.uploadedDocuments['ui:validations'][0];
        const errors = { addError: sandbox.spy() };
        const fieldData = {};

        validation(errors, fieldData);
        expect(errors.addError.called).to.be.true;
      });

      it('should add an error when no file has error message', () => {
        const validation = uiSchema.uploadedDocuments['ui:validations'][0];
        const errors = { addError: sandbox.spy() };
        const fieldData = { errorMessage: 'error' };

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
      const uiSchema = trustPages.trustDocumentUploadPage.uiSchema.trusts.items;

      it('should be a required field', () => {
        expect(uiSchema.uploadedDocuments['ui:required']()).to.be.true;
      });
    });
  });

  describe('trustAdditionalFormNeeded page', () => {
    beforeEach(() => {
      showUpdatedContentStub.returns(true);
    });

    it('should display when showUpdatedContent is true', () => {
      const { depends } = trustPages.trustSupportingDocumentsNeededNeededPage;
      expect(depends({ ...testDataPostMVP.trusts }, 0)).to.be.true;
    });

    it('should not display when showUpdatedContent is false', () => {
      showUpdatedContentStub.returns(false);
      const { depends } = trustPages.trustSupportingDocumentsNeededNeededPage;
      expect(depends({ ...testDataPostMVP.trusts }, 0)).to.be.false;
    });

    describe('updateSchema functionality', () => {
      const schema =
        trustPages.trustSupportingDocumentsNeededNeededPage.schema.properties
          .trusts.items;
      const uiSchema =
        trustPages.trustSupportingDocumentsNeededNeededPage.uiSchema.trusts
          .items;

      it('should clear uploadedDocuments when view:addFormQuestion is false', () => {
        const { updateSchema } = uiSchema['ui:options'];
        const formData = {
          trusts: [
            {
              'view:addFormQuestion': false,
              uploadedDocuments: [{ name: 'test.pdf' }],
            },
          ],
        };
        const index = 0;

        const result = updateSchema(formData, schema, uiSchema, index);

        expect(formData.trusts[0].uploadedDocuments).to.deep.equal([]);
        expect(result).to.equal(schema);
      });

      it('should not clear uploadedDocuments when view:addFormQuestion is true', () => {
        const { updateSchema } = uiSchema['ui:options'];
        const formData = {
          trusts: [
            {
              'view:addFormQuestion': true,
              uploadedDocuments: [{ name: 'test.pdf' }],
            },
          ],
        };
        const index = 0;

        updateSchema(formData, schema, uiSchema, index);

        expect(formData.trusts[0].uploadedDocuments).to.deep.equal([
          { name: 'test.pdf' },
        ]);
      });

      it('should handle undefined uploadedDocuments', () => {
        const { updateSchema } = uiSchema['ui:options'];
        const formData = {
          trusts: [
            {
              'view:addFormQuestion': false,
            },
          ],
        };
        const index = 0;

        expect(() => {
          updateSchema(formData, schema, uiSchema, index);
        }).to.not.throw();

        expect(formData.trusts[0].uploadedDocuments).to.deep.equal([]);
      });

      it('should handle fallback to formData when trusts index is not available', () => {
        const { updateSchema } = uiSchema['ui:options'];
        const formData = {
          'view:addFormQuestion': false,
          uploadedDocuments: [{ name: 'test.pdf' }],
        };
        const index = 0;

        updateSchema(formData, schema, uiSchema, index);

        expect(formData.uploadedDocuments).to.deep.equal([]);
      });
    });

    describe('form validation', () => {
      const schema =
        trustPages.trustSupportingDocumentsNeededNeededPage.schema.properties
          .trusts.items;
      const uiSchema =
        trustPages.trustSupportingDocumentsNeededNeededPage.uiSchema.trusts
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
        { assetType: 'FARM', 'view:addFormQuestion': true },
        { loggedIn: true },
      );
    });
  });

  describe('trustDocumentMailingAddressPage', () => {
    beforeEach(() => {
      showUpdatedContentStub.returns(true);
    });

    it('should display when view:addFormQuestion is false', () => {
      const { depends } = trustPages.trustDocumentMailingAddressPage;
      const formData = {
        trusts: [
          {
            'view:addFormQuestion': false,
          },
        ],
      };
      expect(depends(formData, 0)).to.be.true;
    });

    it('should not display when view:addFormQuestion is true', () => {
      const { depends } = trustPages.trustDocumentMailingAddressPage;
      const formData = {
        trusts: [
          {
            'view:addFormQuestion': true,
          },
        ],
      };
      expect(depends(formData, 0)).to.be.false;
    });

    it('should not display when showUpdatedContent is false', () => {
      showUpdatedContentStub.returns(false);
      const { depends } = trustPages.trustDocumentMailingAddressPage;
      const formData = {
        trusts: [
          {
            'view:addFormQuestion': false,
          },
        ],
      };
      expect(depends(formData, 0)).to.be.false;
    });
  });
});
