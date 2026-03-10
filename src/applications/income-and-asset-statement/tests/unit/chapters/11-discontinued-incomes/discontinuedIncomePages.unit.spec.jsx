import { expect } from 'chai';
import formConfig from '../../../../config/form';
import {
  discontinuedIncomePages,
  options,
} from '../../../../config/chapters/10-discontinued-incomes/discontinuedIncomePages';
import testData from '../../../e2e/fixtures/data/test-data.json';
import testDataZeroes from '../../../e2e/fixtures/data/test-data-all-zeroes.json';

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
} from '../pageTests.spec';

import { discontinuedIncomeTypeLabels } from '../../../../labels';

describe('discontinued income list and loop pages', () => {
  const {
    discontinuedIncomePagesVeteranSummary,
    discontinuedIncomePagesSpouseSummary,
    discontinuedIncomePagesChildSummary,
    discontinuedIncomePagesCustodianSummary,
    discontinuedIncomePagesParentSummary,
    discontinuedIncomeVeteranRecipientPage,
    discontinuedIncomeSpouseRecipientPage,
    discontinuedIncomeCustodianRecipientPage,
    discontinuedIncomeParentRecipientPage,
  } = discontinuedIncomePages;

  describe('text', () => {
    describe('isItemIncomplete function', () => {
      const {
        // eslint-disable-next-line no-unused-vars
        recipientName,
        ...baseItem
      } = testData.data.discontinuedIncomes[0];
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
      testOptionsTextCardDescription(
        options,
        baseItem,
        discontinuedIncomeTypeLabels,
      );
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
      testOptionsTextCardDescription(
        options,
        baseItem,
        discontinuedIncomeTypeLabels,
      );
    });

    describe('summaryTitle function', () => {
      it('should show review title', () => {
        expect(options.text.summaryTitle).to.eql(
          'Review  discontinued and irregular income',
        );
      });
    });
  });

  describe('summary pages', () => {
    describe('veteran summary page', () => {
      const { schema, uiSchema } = discontinuedIncomePagesVeteranSummary;
      const formData = { ...testData.data, claimantType: 'VETERAN' };

      it('should display when claimantType is VETERAN', () => {
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

      it('should display when claimantType is SPOUSE', () => {
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

      it('should display when claimantType is CHILD', () => {
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

      it('should display when claimantType is CUSTODIAN', () => {
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

      it('should display when claimantType is PARENT', () => {
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

  describe('recipient pages', () => {
    describe('Veteran recipient page', () => {
      const formData = { ...testData.data, claimantType: 'VETERAN' };

      it('should display when claimantType is VETERAN', () => {
        const { depends } = discontinuedIncomeVeteranRecipientPage;
        expect(depends(formData)).to.be.true;
      });
    });

    describe('Spouse recipient page', () => {
      const formData = { ...testData.data, claimantType: 'SPOUSE' };

      it('should display when claimantType is SPOUSE', () => {
        const { depends } = discontinuedIncomeSpouseRecipientPage;
        expect(depends(formData)).to.be.true;
      });
    });

    describe('Custodian recipient page', () => {
      const formData = { ...testData.data, claimantType: 'CUSTODIAN' };

      it('should display when claimantType is CUSTODIAN', () => {
        const { depends } = discontinuedIncomeCustodianRecipientPage;
        expect(depends(formData)).to.be.true;
      });
    });

    describe('Parent recipient page', () => {
      const formData = { ...testData.data, claimantType: 'PARENT' };

      it('should display when claimantType is PARENT', () => {
        const { depends } = discontinuedIncomeParentRecipientPage;
        expect(depends(formData)).to.be.true;
      });
    });

    describe('Income recipient pages', () => {
      const formData = { ...testData.data, claimantType: 'CHILD' };

      it('should NOT display any recipient pages when claimantType is CHILD', () => {
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
        'va-text-input[label="First or given name"]',
        'va-text-input[label="Last or family name"]',
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
      testData.data.discontinuedIncomes[0],
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
      testData.data.discontinuedIncomes[0],
      { loggedIn: true },
    );
  });
});
