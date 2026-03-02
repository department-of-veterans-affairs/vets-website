import { expect } from 'chai';
import formConfig from '../../../../config/form';
import {
  unassociatedIncomePages,
  options,
} from '../../../../config/chapters/02-unassociated-incomes/unassociatedIncomePages';
import { incomeTypeLabels } from '../../../../labels';
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

describe('unassociated income list and loop pages', () => {
  const {
    unassociatedIncomeVeteranRecipientPage,
    unassociatedIncomeSpouseRecipientPage,
    unassociatedIncomeCustodianRecipientPage,
    unassociatedIncomeParentRecipientPage,
    unassociatedIncomeChildRecipientNamePage,
    unassociatedIncomeRecipientNamePage,
  } = unassociatedIncomePages;

  describe('isItemIncomplete function', () => {
    // eslint-disable-next-line no-unused-vars
    const { recipientName, ...baseItem } = testData.data.unassociatedIncomes[0];
    testOptionsIsItemIncomplete(options, baseItem);
  });

  describe('isItemIncomplete function tested with zeroes', () => {
    const baseItem = testDataZeroes.data.unassociatedIncomes[0];
    testOptionsIsItemIncompleteWithZeroes(options, baseItem);
  });

  describe('text getItemName function', () => {
    testOptionsTextGetItemNameRecurringIncome(options);
  });

  describe('summaryTitle function', () => {
    it('should show content', () => {
      expect(options.text.summaryTitle).to.eql('Review recurring income');
    });
  });

  describe('text cardDescription function', () => {
    /* eslint-disable no-unused-vars */
    const {
      recipientRelationship,
      recipientName,
      payer,
      ...baseItem
    } = testData.data.unassociatedIncomes[0];
    /* eslint-enable no-unused-vars */
    testOptionsTextCardDescription(options, baseItem, incomeTypeLabels);
  });

  describe('text cardDescription function with zero values', () => {
    /* eslint-disable no-unused-vars */
    const {
      recipientRelationship,
      recipientName,
      payer,
      ...baseItem
    } = testData.data.unassociatedIncomes[0];
    /* eslint-enable no-unused-vars */
    testOptionsTextCardDescription(options, baseItem, incomeTypeLabels);
  });

  describe('recipient pages', () => {
    describe('Veteran recipient page', () => {
      const formData = { ...testData.data, claimantType: 'VETERAN' };

      it('should display when showUpdatedContent is true and claimantType is VETERAN', () => {
        const { depends } = unassociatedIncomeVeteranRecipientPage;
        expect(depends(formData)).to.be.true;
      });
    });

    describe('Spouse recipient page', () => {
      const formData = { ...testData.data, claimantType: 'SPOUSE' };

      it('should display when showUpdatedContent is true and claimantType is SPOUSE', () => {
        const { depends } = unassociatedIncomeSpouseRecipientPage;
        expect(depends(formData)).to.be.true;
      });
    });

    describe('Custodian recipient page', () => {
      const formData = { ...testData.data, claimantType: 'CUSTODIAN' };

      it('should display when showUpdatedContent is true and claimantType is CUSTODIAN', () => {
        const { depends } = unassociatedIncomeCustodianRecipientPage;
        expect(depends(formData)).to.be.true;
      });
    });

    describe('Parent recipient page', () => {
      const formData = { ...testData.data, claimantType: 'PARENT' };

      it('should display when showUpdatedContent is true and claimantType is PARENT', () => {
        const { depends } = unassociatedIncomeParentRecipientPage;
        expect(depends(formData)).to.be.true;
      });
    });

    describe('Income recipient pages', () => {
      const formData = { ...testData.data, claimantType: 'CHILD' };

      it('should NOT display any recipient pages when claimantType is CHILD', () => {
        expect(unassociatedIncomeVeteranRecipientPage.depends(formData)).to.be
          .false;
        expect(unassociatedIncomeSpouseRecipientPage.depends(formData)).to.be
          .false;
        expect(unassociatedIncomeCustodianRecipientPage.depends(formData)).to.be
          .false;
        expect(unassociatedIncomeParentRecipientPage.depends(formData)).to.be
          .false;
      });
    });
  });

  describe('recipient name page', () => {
    const schema =
      unassociatedIncomeRecipientNamePage.schema.properties.unassociatedIncomes
        .items;
    const uiSchema =
      unassociatedIncomeRecipientNamePage.uiSchema.unassociatedIncomes.items;

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
      testData.data.unassociatedIncomes[0],
      { loggedIn: true },
    );

    it('should not show recipient name page when claimantType is CHILD', () => {
      const formData = { ...testData.data, claimantType: 'CHILD' };
      expect(unassociatedIncomeRecipientNamePage.depends(formData)).to.be.false;
    });
  });

  describe('child recipient name page', () => {
    const schema =
      unassociatedIncomeChildRecipientNamePage.schema.properties
        .unassociatedIncomes.items;
    const uiSchema =
      unassociatedIncomeChildRecipientNamePage.uiSchema.unassociatedIncomes
        .items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-text-input': 3 },
      'child recipient',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      [
        'va-text-input[label="First or given name"]',
        'va-text-input[label="Last or family name"]',
      ],
      'child recipient',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'child recipient',
      testData.data.unassociatedIncomes[0],
      { loggedIn: true },
    );

    it('should show child recipient name page when claimantType is CHILD', () => {
      const formData = { ...testData.data, claimantType: 'CHILD' };
      expect(unassociatedIncomeChildRecipientNamePage.depends(formData)).to.be
        .true;
    });

    it('should not show child recipient name page when claimantType is not CHILD', () => {
      const formData = { ...testData.data, claimantType: 'SPOUSE' };
      expect(unassociatedIncomeChildRecipientNamePage.depends(formData)).to.be
        .false;
    });
  });

  describe('income type page', () => {
    const schema =
      unassociatedIncomePages.unassociatedIncomeTypePage.schema.properties
        .unassociatedIncomes.items;
    const uiSchema =
      unassociatedIncomePages.unassociatedIncomeTypePage.uiSchema
        .unassociatedIncomes.items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 1, 'va-text-input': 2 },
      'income type',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      [
        'va-radio[label="What type of income is it?"]',
        'va-text-input[label="What\'s the gross monthly income from this financial account?"]',
        'va-text-input[label="Who pays the income?"]',
      ],
      'income type',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'income type',
      testData.data.unassociatedIncomes[0],
      { loggedIn: true },
    );
  });
});
