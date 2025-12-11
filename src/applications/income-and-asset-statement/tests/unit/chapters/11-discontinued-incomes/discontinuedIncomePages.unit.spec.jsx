import { expect } from 'chai';
import sinon from 'sinon';
import formConfig from '../../../../config/form';
import {
  discontinuedIncomePages,
  options,
} from '../../../../config/chapters/10-discontinued-incomes/discontinuedIncomePages';
import * as helpers from '../../../../helpers';
import testData from '../../../e2e/fixtures/data/test-data.json';
import testDataZeroes from '../../../e2e/fixtures/data/test-data-all-zeroes.json';
import testDataPostMVP from '../../../e2e/fixtures/data/test-data-post-mvp.json';

import {
  testOptionsIsItemIncomplete,
  testOptionsIsItemIncompleteWithZeroes,
  testOptionsTextGetItemNameRecurringIncome,
  testOptionsTextCardDescription,
} from '../multiPageTests.spec';
import {
  testNumberOfFieldsByType,
  testComponentFieldsMarkedAsRequired,
  testSubmitsWithoutErrors,
  testSelectAndValidateField,
} from '../pageTests.spec';

describe('discontinued income list and loop pages', () => {
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
    discontinuedIncomePagesSummary,
    discontinuedIncomePagesVeteranSummary,
    discontinuedIncomePagesSpouseSummary,
    discontinuedIncomePagesChildSummary,
    discontinuedIncomePagesCustodianSummary,
    discontinuedIncomePagesParentSummary,
    discontinuedIncomeVeteranRecipientPage,
    discontinuedIncomeSpouseRecipientPage,
    discontinuedIncomeCustodianRecipientPage,
    discontinuedIncomeParentRecipientPage,
    discontinuedIncomeNonVeteranRecipientPage,
  } = discontinuedIncomePages;

  describe('text', () => {
    describe('isItemIncomplete function', () => {
      const baseItem = testData.data.discontinuedIncomes[0];
      testOptionsIsItemIncomplete(options, baseItem);
    });

    describe('isItemIncomplete function tested with zeroes', () => {
      const baseItem = testDataZeroes.data.discontinuedIncomes[0];
      testOptionsIsItemIncompleteWithZeroes(options, baseItem);
    });

    describe('text getItemName function', () => {
      testOptionsTextGetItemNameRecurringIncome(options);
    });

    describe('text cardDescription function', () => {
      /* eslint-disable no-unused-vars */
      const {
        payer,
        incomeFrequency,
        recipientRelationship,
        recipientName,
        ...baseItem
      } = testData.data.discontinuedIncomes[0];
      /* eslint-enable no-unused-vars */
      testOptionsTextCardDescription(options, baseItem);
    });

    describe('text cardDescription function with zero values', () => {
      /* eslint-disable no-unused-vars */
      const {
        payer,
        incomeFrequency,
        recipientRelationship,
        recipientName,
        ...baseItem
      } = testDataZeroes.data.discontinuedIncomes[0];
      /* eslint-enable no-unused-vars */
      testOptionsTextCardDescription(options, baseItem);
    });

    describe('summaryTitle function', () => {
      it('should show review title', () => {
        expect(options.text.summaryTitle).to.eql(
          'Review  discontinued and irregular income',
        );
      });
    });

    describe('summaryDescriptionWithoutItems', () => {
      it('should return null when showUpdatedContent is false', () => {
        expect(options.text.summaryDescriptionWithoutItems).to.be.null;
      });
    });
  });

  describe('MVP summary page', () => {
    beforeEach(() => {
      showUpdatedContentStub.returns(false);
    });

    const { schema, uiSchema } = discontinuedIncomePagesSummary;

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
        'va-radio[label="Did you or your dependents receive income that has stopped or is no longer being received within the last calendar year?"]',
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

  describe('Post MVP summary pages', () => {
    beforeEach(() => {
      showUpdatedContentStub.returns(true);
    });

    describe('veteran summary page', () => {
      const { schema, uiSchema } = discontinuedIncomePagesVeteranSummary;
      const formData = { ...testData.data, claimantType: 'VETERAN' };

      it('should display when showUpdatedContent is true and claimantType is VETERAN', () => {
        const { depends } = discontinuedIncomePagesVeteranSummary;
        expect(depends(formData)).to.be.true;
      });

      it('should have modified hint text for veteran', () => {
        expect(
          uiSchema['view:isAddingDiscontinuedIncomes'][
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
      const { schema, uiSchema } = discontinuedIncomePagesSpouseSummary;
      const formData = { ...testData.data, claimantType: 'SPOUSE' };

      it('should display when showUpdatedContent is true and claimantType is SPOUSE', () => {
        const { depends } = discontinuedIncomePagesSpouseSummary;
        expect(depends(formData)).to.be.true;
      });

      it('should have modified hint text for spouse', () => {
        expect(
          uiSchema['view:isAddingDiscontinuedIncomes'][
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
      const { schema, uiSchema } = discontinuedIncomePagesChildSummary;
      const formData = { ...testData.data, claimantType: 'CHILD' };

      it('should display when showUpdatedContent is true and claimantType is CHILD', () => {
        const { depends } = discontinuedIncomePagesChildSummary;
        expect(depends(formData)).to.be.true;
      });

      it('should have modified title text for child', () => {
        expect(
          uiSchema['view:isAddingDiscontinuedIncomes']['ui:title'],
        ).to.equal(
          'Have you received income that has ended during the reporting period or in the last full calendar year (if this is your first claim)?',
        );
      });

      it('should have no hint text for child', () => {
        expect(uiSchema['view:isAddingDiscontinuedIncomes']['ui:options'].hint)
          .to.be.undefined;
      });

      it('should have correct option labels', () => {
        const { labels } = uiSchema['view:isAddingDiscontinuedIncomes'][
          'ui:options'
        ].updateUiSchema()['ui:options'];
        expect(labels.Y).to.equal('Yes, I have income to report');
        expect(labels.N).to.equal('No, I don’t have income to report');
      });

      it('should have correct labelHeaderLevel configuration', () => {
        const { labelHeaderLevel } = uiSchema[
          'view:isAddingDiscontinuedIncomes'
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
      const { schema, uiSchema } = discontinuedIncomePagesCustodianSummary;
      const formData = { ...testData.data, claimantType: 'CUSTODIAN' };

      it('should display when showUpdatedContent is true and claimantType is CUSTODIAN', () => {
        const { depends } = discontinuedIncomePagesCustodianSummary;
        expect(depends(formData)).to.be.true;
      });

      it('should have modified hint text for custodian', () => {
        expect(
          uiSchema['view:isAddingDiscontinuedIncomes'][
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
      const { schema, uiSchema } = discontinuedIncomePagesParentSummary;
      const formData = { ...testData.data, claimantType: 'PARENT' };

      it('should display when showUpdatedContent is true and claimantType is PARENT', () => {
        const { depends } = discontinuedIncomePagesParentSummary;
        expect(depends(formData)).to.be.true;
      });

      it('should have modified hint text for parent', () => {
        expect(
          uiSchema['view:isAddingDiscontinuedIncomes'][
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
    beforeEach(() => {
      showUpdatedContentStub.returns(false);
    });

    const schema =
      discontinuedIncomeNonVeteranRecipientPage.schema.properties
        .discontinuedIncomes.items;
    const uiSchema =
      discontinuedIncomeNonVeteranRecipientPage.uiSchema.discontinuedIncomes
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
      ['va-radio[name="root_recipientRelationship"]'],
      'relationship',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'relationship',
      testData.data.discontinuedIncomes[0],
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
        const { depends } = discontinuedIncomeNonVeteranRecipientPage;
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
        const { depends } = discontinuedIncomeVeteranRecipientPage;
        expect(depends(formData)).to.be.true;
      });
    });

    describe('Spouse recipient page', () => {
      const formData = { ...testData.data, claimantType: 'SPOUSE' };

      it('should display when showUpdatedContent is true and claimantType is SPOUSE', () => {
        const { depends } = discontinuedIncomeSpouseRecipientPage;
        expect(depends(formData)).to.be.true;
      });
    });

    describe('Custodian recipient page', () => {
      const formData = { ...testData.data, claimantType: 'CUSTODIAN' };

      it('should display when showUpdatedContent is true and claimantType is CUSTODIAN', () => {
        const { depends } = discontinuedIncomeCustodianRecipientPage;
        expect(depends(formData)).to.be.true;
      });
    });

    describe('Parent recipient page', () => {
      const formData = { ...testData.data, claimantType: 'PARENT' };

      it('should display when showUpdatedContent is true and claimantType is PARENT', () => {
        const { depends } = discontinuedIncomeParentRecipientPage;
        expect(depends(formData)).to.be.true;
      });
    });

    describe('Income recipient pages', () => {
      const formData = { ...testData.data, claimantType: 'CHILD' };

      it('should NOT display any recipient pages when claimantType is CHILD', () => {
        expect(discontinuedIncomeNonVeteranRecipientPage.depends(formData)).to
          .be.false;
        expect(discontinuedIncomeVeteranRecipientPage.depends(formData)).to.be
          .false;
        expect(discontinuedIncomeSpouseRecipientPage.depends(formData)).to.be
          .false;
        expect(discontinuedIncomeCustodianRecipientPage.depends(formData)).to.be
          .false;
        expect(discontinuedIncomeParentRecipientPage.depends(formData)).to.be
          .false;
      });
    });
  });

  describe('recipient name page', () => {
    const schema =
      discontinuedIncomePages.discontinuedIncomeRecipientNamePage.schema
        .properties.discontinuedIncomes.items;
    const uiSchema =
      discontinuedIncomePages.discontinuedIncomeRecipientNamePage.uiSchema
        .discontinuedIncomes.items;

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
      testData.data.discontinuedIncomes[0],
      { loggedIn: true },
    );
  });

  describe('MVP pages', () => {
    describe('payer page', () => {
      const schema =
        discontinuedIncomePages.discontinuedIncomePayerPage.schema.properties
          .discontinuedIncomes.items;
      const uiSchema =
        discontinuedIncomePages.discontinuedIncomePayerPage.uiSchema
          .discontinuedIncomes.items;

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
        ['va-text-input[label="Income payer name"]'],
        'payer',
      );
      testSubmitsWithoutErrors(
        formConfig,
        schema,
        uiSchema,
        'payer',
        testData.data.discontinuedIncomes[0],
        { loggedIn: true },
      );
    });

    describe('type page', () => {
      const schema =
        discontinuedIncomePages.discontinuedIncomeTypePage.schema.properties
          .discontinuedIncomes.items;
      const uiSchema =
        discontinuedIncomePages.discontinuedIncomeTypePage.uiSchema
          .discontinuedIncomes.items;

      testNumberOfFieldsByType(
        formConfig,
        schema,
        uiSchema,
        { 'va-text-input': 1 },
        'type',
      );
      testComponentFieldsMarkedAsRequired(
        formConfig,
        schema,
        uiSchema,
        ['va-text-input[label="What is the type of income received?"]'],
        'type',
      );
      testSubmitsWithoutErrors(
        formConfig,
        schema,
        uiSchema,
        'type',
        testData.data.discontinuedIncomes[0],
        { loggedIn: true },
      );
    });

    describe('frequency page', () => {
      const schema =
        discontinuedIncomePages.discontinuedIncomeFrequencyPage.schema
          .properties.discontinuedIncomes.items;
      const uiSchema =
        discontinuedIncomePages.discontinuedIncomeFrequencyPage.uiSchema
          .discontinuedIncomes.items;

      testNumberOfFieldsByType(
        formConfig,
        schema,
        uiSchema,
        { 'va-radio': 1 },
        'frequency',
      );
      testComponentFieldsMarkedAsRequired(
        formConfig,
        schema,
        uiSchema,
        ['va-radio[name="root_incomeFrequency"]'],
        'frequency',
      );
      testSubmitsWithoutErrors(
        formConfig,
        schema,
        uiSchema,
        'frequency',
        testData.data.discontinuedIncomes[0],
        { loggedIn: true },
      );
    });

    describe('date page', () => {
      const schema =
        discontinuedIncomePages.discontinuedIncomeDatePage.schema.properties
          .discontinuedIncomes.items;
      const uiSchema =
        discontinuedIncomePages.discontinuedIncomeDatePage.uiSchema
          .discontinuedIncomes.items;

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
        ['va-memorable-date[name="root_incomeLastReceivedDate"]'],
        'date',
      );
      testSubmitsWithoutErrors(
        formConfig,
        schema,
        uiSchema,
        'date',
        testData.data.discontinuedIncomes[0],
        { loggedIn: true },
      );
    });

    describe('amount page', () => {
      const schema =
        discontinuedIncomePages.discontinuedIncomeAmountPage.schema.properties
          .discontinuedIncomes.items;
      const uiSchema =
        discontinuedIncomePages.discontinuedIncomeAmountPage.uiSchema
          .discontinuedIncomes.items;

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
        testData.data.discontinuedIncomes[0],
        { loggedIn: true },
      );
    });
  });

  describe('Post MVP pages', () => {
    beforeEach(() => {
      showUpdatedContentStub.returns(true);
    });

    describe('information page', () => {
      const schema =
        discontinuedIncomePages.discontinuedIncomeInformationPage.schema
          .properties.discontinuedIncomes.items;
      const uiSchema =
        discontinuedIncomePages.discontinuedIncomeInformationPage.uiSchema
          .discontinuedIncomes.items;

      testNumberOfFieldsByType(
        formConfig,
        schema,
        uiSchema,
        { 'va-text-input': 1, 'va-radio': 1 },
        'information',
      );
      testComponentFieldsMarkedAsRequired(
        formConfig,
        schema,
        uiSchema,
        ['va-text-input[label="Who paid this income?"]'],
        ['va-radio[label="What type of income is it?"]'],
        'information',
      );
      testSubmitsWithoutErrors(
        formConfig,
        schema,
        uiSchema,
        'information',
        testDataPostMVP.data.discontinuedIncomes[0],
        { loggedIn: true },
      );
    });

    describe('payment page', () => {
      const schema =
        discontinuedIncomePages.discontinuedIncomePaymentPage.schema.properties
          .discontinuedIncomes.items;
      const uiSchema =
        discontinuedIncomePages.discontinuedIncomePaymentPage.uiSchema
          .discontinuedIncomes.items;

      testNumberOfFieldsByType(
        formConfig,
        schema,
        uiSchema,
        { 'va-radio': 1, 'va-memorable-date': 1 },
        'payment',
      );
      testComponentFieldsMarkedAsRequired(
        formConfig,
        schema,
        uiSchema,
        ['va-radio[label="How often was this income received?"]'],
        ['va-memorable-date[label="When was this income last received?"]'],
        'payment',
      );
      testSubmitsWithoutErrors(
        formConfig,
        schema,
        uiSchema,
        'payment',
        testDataPostMVP.data.discontinuedIncomes[0],
        { loggedIn: true },
      );
    });
  });
});
