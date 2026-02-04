import { expect } from 'chai';
import sinon from 'sinon';
import formConfig from '../../../../config/form';
import {
  incomeReceiptWaiverPages,
  options,
} from '../../../../config/chapters/11-income-receipt-waivers/incomeReceiptWaiverPages';
import * as helpers from '../../../../helpers';
import { relationshipLabels } from '../../../../labels';
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

describe('income receipt waiver list and loop pages', () => {
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
    incomeReceiptWaiverPagesSummary,
    incomeReceiptWaiverPagesVeteranSummary,
    incomeReceiptWaiverPagesSpouseSummary,
    incomeReceiptWaiverPagesChildSummary,
    incomeReceiptWaiverPagesCustodianSummary,
    incomeReceiptWaiverPagesParentSummary,
    incomeReceiptWaiverVeteranRecipientPage,
    incomeReceiptWaiverSpouseRecipientPage,
    incomeReceiptWaiverCustodianRecipientPage,
    incomeReceiptWaiverParentRecipientPage,
    incomeReceiptWaiverNonVeteranRecipientPage,
  } = incomeReceiptWaiverPages;

  describe('isItemIncomplete function', () => {
    /* eslint-disable no-unused-vars */
    const {
      expectedIncome,
      'view:paymentsWillResume': _,
      paymentResumeDate,
      ...baseItem
    } = testData.data.incomeReceiptWaivers[0];
    /* eslint-enable no-unused-vars */
    testOptionsIsItemIncomplete(options, baseItem);
  });

  describe('isItemIncomplete function tested with zeroes', () => {
    /* eslint-disable no-unused-vars */
    const {
      expectedIncome,
      'view:paymentsWillResume': _,
      paymentResumeDate,
      ...baseItem
    } = testDataZeroes.data.incomeReceiptWaivers[0];
    /* eslint-enable no-unused-vars */
    testOptionsIsItemIncompleteWithZeroes(options, baseItem);
  });

  describe('text getItemName function', () => {
    const mockFormData = {
      isLoggedIn: true,
      veteranFullName: { first: 'John', last: 'Doe' },
      otherVeteranFullName: { first: 'Alex', last: 'Smith' },
    };
    it('should return "John Doe’s waived income from `payer`" if recipient is Veteran', () => {
      const item = {
        recipientRelationship: 'VETERAN',
        recipientName: { first: 'Jane', last: 'Smith' },
        payer: 'social security',
      };
      expect(options.text.getItemName(item, 0, mockFormData)).to.equal(
        'John Doe’s waived income from social security',
      );
    });
    it('should return "Alex Smith’s waived income from `payer`" if recipient is Veteran and not logged in', () => {
      const item = {
        recipientRelationship: 'VETERAN',
        recipientName: { first: 'Jane', last: 'Smith' },
        payer: 'social security',
      };
      expect(
        options.text.getItemName(item, 0, {
          ...mockFormData,
          isLoggedIn: false,
        }),
      ).to.equal('Alex Smith’s waived income from social security');
    });
    it('should return "Jane Smith’s waived income from `payer`" if recipient is not Veteran', () => {
      const item = {
        recipientRelationship: 'SPOUSE',
        recipientName: { first: 'Jane', last: 'Smith' },
        payer: 'social security',
      };
      expect(options.text.getItemName(item, 0, mockFormData)).to.equal(
        'Jane Smith’s waived income from social security',
      );
    });
  });

  describe('text cardDescription function', () => {
    /* eslint-disable no-unused-vars */
    const {
      expectedIncome,
      'view:paymentsWillResume': _,
      recipientRelationship,
      recipientName,
      payer,
      paymentResumeDate,
      ...baseItem
    } = testData.data.incomeReceiptWaivers[0];
    /* eslint-enable no-unused-vars */
    testOptionsTextCardDescription(options, baseItem, relationshipLabels);
  });

  describe('text cardDescription function with zero values', () => {
    /* eslint-disable no-unused-vars */
    const {
      expectedIncome,
      'view:paymentsWillResume': _,
      recipientRelationship,
      recipientName,
      payer,
      paymentResumeDate,
      ...baseItem
    } = testDataZeroes.data.incomeReceiptWaivers[0];
    /* eslint-enable no-unused-vars */
    testOptionsTextCardDescription(options, baseItem, relationshipLabels);
  });

  describe('MVP summary page', () => {
    beforeEach(() => {
      showUpdatedContentStub.returns(false);
    });

    const { schema, uiSchema } = incomeReceiptWaiverPagesSummary;
    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 1 },
      'annuity summary page',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      [
        'va-radio[label="Did you or your dependents waive or expect to waive any receipt of income in the next 12 months?"]',
      ],
      'annuity summary page',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'annuity summary page',
      testData.data,
      { loggedIn: true },
    );
  });

  describe('Post MVP summary pages', () => {
    beforeEach(() => {
      showUpdatedContentStub.returns(true);
    });

    describe('veteran summary page', () => {
      const { schema, uiSchema } = incomeReceiptWaiverPagesVeteranSummary;
      const formData = { ...testData.data, claimantType: 'VETERAN' };

      it('should display when showUpdatedContent is true and claimantType is VETERAN', () => {
        const { depends } = incomeReceiptWaiverPagesVeteranSummary;
        expect(depends(formData)).to.be.true;
      });

      it('should have modified hint text for veteran', () => {
        expect(
          uiSchema['view:isAddingIncomeReceiptWaivers'][
            'ui:options'
          ].updateUiSchema()['ui:options'].hint,
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
      const { schema, uiSchema } = incomeReceiptWaiverPagesSpouseSummary;
      const formData = { ...testData.data, claimantType: 'SPOUSE' };

      it('should display when showUpdatedContent is true and claimantType is SPOUSE', () => {
        const { depends } = incomeReceiptWaiverPagesSpouseSummary;
        expect(depends(formData)).to.be.true;
      });

      it('should have modified hint text for spouse', () => {
        expect(
          uiSchema['view:isAddingIncomeReceiptWaivers'][
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
      const { schema, uiSchema } = incomeReceiptWaiverPagesChildSummary;
      const formData = { ...testData.data, claimantType: 'CHILD' };

      it('should display when showUpdatedContent is true and claimantType is CHILD', () => {
        const { depends } = incomeReceiptWaiverPagesChildSummary;
        expect(depends(formData)).to.be.true;
      });

      it('should have modified title text for child', () => {
        expect(
          uiSchema['view:isAddingIncomeReceiptWaivers']['ui:title'],
        ).to.equal('Do you plan to waive any income in the next 12 months?');
      });

      it('should have no hint text for child', () => {
        expect(uiSchema['view:isAddingIncomeReceiptWaivers']['ui:options'].hint)
          .to.be.undefined;
      });

      it('should have correct option labels', () => {
        const { labels } = uiSchema['view:isAddingIncomeReceiptWaivers'][
          'ui:options'
        ].updateUiSchema()['ui:options'];
        expect(labels.Y).to.equal('Yes, I have waived income to report');
        expect(labels.N).to.equal('No, I don’t have waived income to report');
      });

      it('should have correct labelHeaderLevel configuration', () => {
        const { labelHeaderLevel } = uiSchema[
          'view:isAddingIncomeReceiptWaivers'
        ]['ui:options'].updateUiSchema()['ui:options'];

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
      const { schema, uiSchema } = incomeReceiptWaiverPagesCustodianSummary;
      const formData = { ...testData.data, claimantType: 'CUSTODIAN' };

      it('should display when showUpdatedContent is true and claimantType is CUSTODIAN', () => {
        const { depends } = incomeReceiptWaiverPagesCustodianSummary;
        expect(depends(formData)).to.be.true;
      });

      it('should have modified hint text for custodian', () => {
        expect(
          uiSchema['view:isAddingIncomeReceiptWaivers'][
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
      const { schema, uiSchema } = incomeReceiptWaiverPagesParentSummary;
      const formData = { ...testData.data, claimantType: 'PARENT' };

      it('should display when showUpdatedContent is true and claimantType is PARENT', () => {
        const { depends } = incomeReceiptWaiverPagesParentSummary;
        expect(depends(formData)).to.be.true;
      });

      it('should have modified hint text for parent', () => {
        expect(
          uiSchema['view:isAddingIncomeReceiptWaivers'][
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

  describe('MVP income recipient page', () => {
    const schema =
      incomeReceiptWaiverNonVeteranRecipientPage.schema.properties
        .incomeReceiptWaivers.items;
    const uiSchema =
      incomeReceiptWaiverNonVeteranRecipientPage.uiSchema.incomeReceiptWaivers
        .items;

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
      ['va-radio[label="Who has waived income to report?"]'],
      'relationship',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'relationship',
      testData.data.incomeReceiptWaivers[0],
      { loggedIn: true },
    );
    testSelectAndValidateField(
      formConfig,
      schema,
      uiSchema,
      'relationship',
      'root_otherRecipientRelationshipType',
    );

    describe('Non-Veteran recipient page', () => {
      it('should display when showUpdatedContent is false', () => {
        const formData = { ...testData.data, claimantType: 'SPOUSE' };
        const { depends } = incomeReceiptWaiverNonVeteranRecipientPage;
        expect(depends(formData)).to.be.true;
      });
    });
  });

  describe('Updated recipient pages', () => {
    beforeEach(() => {
      showUpdatedContentStub.returns(true);
    });

    describe('Veteran recipient page', () => {
      const formData = { ...testData.data, claimantType: 'VETERAN' };

      it('should display when showUpdatedContent is true and claimantType is VETERAN', () => {
        const { depends } = incomeReceiptWaiverVeteranRecipientPage;
        expect(depends(formData)).to.be.true;
      });
    });

    describe('Spouse recipient page', () => {
      const formData = { ...testData.data, claimantType: 'SPOUSE' };

      it('should display when showUpdatedContent is true and claimantType is SPOUSE', () => {
        const { depends } = incomeReceiptWaiverSpouseRecipientPage;
        expect(depends(formData)).to.be.true;
      });
    });

    describe('Custodian recipient page', () => {
      const formData = { ...testData.data, claimantType: 'CUSTODIAN' };

      it('should display when showUpdatedContent is true and claimantType is CUSTODIAN', () => {
        const { depends } = incomeReceiptWaiverCustodianRecipientPage;
        expect(depends(formData)).to.be.true;
      });
    });

    describe('Parent recipient page', () => {
      const formData = { ...testData.data, claimantType: 'PARENT' };

      it('should display when showUpdatedContent is true and claimantType is PARENT', () => {
        const { depends } = incomeReceiptWaiverParentRecipientPage;
        expect(depends(formData)).to.be.true;
      });
    });

    describe('Income recipient pages', () => {
      const formData = { ...testData.data, claimantType: 'CHILD' };

      it('should NOT display any recipient pages when claimantType is CHILD', () => {
        expect(incomeReceiptWaiverNonVeteranRecipientPage.depends(formData)).to
          .be.false;
        expect(incomeReceiptWaiverVeteranRecipientPage.depends(formData)).to.be
          .false;
        expect(incomeReceiptWaiverSpouseRecipientPage.depends(formData)).to.be
          .false;
        expect(incomeReceiptWaiverCustodianRecipientPage.depends(formData)).to
          .be.false;
        expect(incomeReceiptWaiverParentRecipientPage.depends(formData)).to.be
          .false;
      });
    });
  });

  describe('recipient name page', () => {
    const schema =
      incomeReceiptWaiverPages.incomeReceiptWaiverRecipientNamePage.schema
        .properties.incomeReceiptWaivers.items;
    const uiSchema =
      incomeReceiptWaiverPages.incomeReceiptWaiverRecipientNamePage.uiSchema
        .incomeReceiptWaivers.items;

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
        'va-text-input[label="Income recipient’s first or given name"]',
        'va-text-input[label="Income recipient’s last or family name"]',
      ],
      'recipient',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'recipient',
      testData.data.incomeReceiptWaivers[0],
      { loggedIn: true },
    );
  });

  describe('payer page', () => {
    const schema =
      incomeReceiptWaiverPages.incomeReceiptWaiverPayerPage.schema.properties
        .incomeReceiptWaivers.items;
    const uiSchema =
      incomeReceiptWaiverPages.incomeReceiptWaiverPayerPage.uiSchema
        .incomeReceiptWaivers.items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-text-input': 1 },
      'payer',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      ['va-text-input[label="Who pays this waived income?"]'],
      'payer',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'payer',
      testData.data.incomeReceiptWaivers[0],
      { loggedIn: true },
    );
  });

  describe('amount page', () => {
    const schema =
      incomeReceiptWaiverPages.incomeReceiptWaiverGrossAmountPage.schema
        .properties.incomeReceiptWaivers.items;
    const uiSchema =
      incomeReceiptWaiverPages.incomeReceiptWaiverGrossAmountPage.uiSchema
        .incomeReceiptWaivers.items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-text-input': 1 },
      'amount',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'amount',
      testData.data.incomeReceiptWaivers[0],
      { loggedIn: true },
    );
  });

  describe('payments page', () => {
    const schema =
      incomeReceiptWaiverPages.incomeReceiptWaiverPaymentsPage.schema.properties
        .incomeReceiptWaivers.items;
    const uiSchema =
      incomeReceiptWaiverPages.incomeReceiptWaiverPaymentsPage.uiSchema
        .incomeReceiptWaivers.items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 1 },
      'payments',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      ['va-radio[label="Will payments from this waived income start again?"]'],
      'payments',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'payments',
      testData.data.incomeReceiptWaivers[0],
      { loggedIn: true },
    );
  });

  describe('date page', () => {
    const schema =
      incomeReceiptWaiverPages.incomeReceiptWaiverDatePage.schema.properties
        .incomeReceiptWaivers.items;
    const uiSchema =
      incomeReceiptWaiverPages.incomeReceiptWaiverDatePage.uiSchema
        .incomeReceiptWaivers.items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-memorable-date': 1 },
      'date',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      ['va-memorable-date[label="When will the payments start again?"]'],
      'date',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'date',
      testData.data.incomeReceiptWaivers[0],
      { loggedIn: true },
    );
  });

  describe('amount page', () => {
    const schema =
      incomeReceiptWaiverPages.incomeReceiptWaiverExpectedAmountPage.schema
        .properties.incomeReceiptWaivers.items;
    const uiSchema =
      incomeReceiptWaiverPages.incomeReceiptWaiverExpectedAmountPage.uiSchema
        .incomeReceiptWaivers.items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-text-input': 1 },
      'amount',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'amount',
      testData.data.incomeReceiptWaivers[0],
      { loggedIn: true },
    );
  });
});
