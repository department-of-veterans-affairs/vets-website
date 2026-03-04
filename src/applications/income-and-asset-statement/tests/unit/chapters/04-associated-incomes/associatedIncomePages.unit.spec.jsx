import { expect } from 'chai';
import formConfig from '../../../../config/form';
import {
  associatedIncomePages,
  options,
} from '../../../../config/chapters/03-associated-incomes/associatedIncomePages';
import { incomeTypeEarnedLabels } from '../../../../labels';
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

describe('associated income list and loop pages', () => {
  const {
    associatedIncomeVeteranRecipientPage,
    associatedIncomeSpouseRecipientPage,
    associatedIncomeCustodianRecipientPage,
    associatedIncomeParentRecipientPage,
    associatedIncomeChildRecipientNamePage,
    associatedIncomeRecipientNamePage,
    associatedIncomeTypePage,
  } = associatedIncomePages;

  describe('isItemIncomplete function', () => {
    // eslint-disable-next-line no-unused-vars
    const { recipientName, ...baseItem } = testData.data.associatedIncomes[0];
    testOptionsIsItemIncomplete(options, baseItem);
  });

  describe('isItemIncomplete function tested with zeroes', () => {
    const baseItem = testDataZeroes.data.associatedIncomes[0];
    testOptionsIsItemIncompleteWithZeroes(options, baseItem);
  });

  describe('text getItemName function', () => {
    testOptionsTextGetItemNameRecurringIncome(options);
  });

  describe('text cardDescription function', () => {
    /* eslint-disable no-unused-vars */
    const {
      recipientRelationship,
      recipientName,
      accountValue,
      payer,
      ...baseItem
    } = testData.data.associatedIncomes[0];
    /* eslint-enable no-unused-vars */

    testOptionsTextCardDescription(options, baseItem, incomeTypeEarnedLabels);
  });

  describe('text cardDescription function with zero values', () => {
    /* eslint-disable no-unused-vars */
    const {
      recipientRelationship,
      recipientName,
      accountValue,
      payer,
      ...baseItem
    } = testDataZeroes.data.associatedIncomes[0];
    /* eslint-enable no-unused-vars */
    testOptionsTextCardDescription(options, baseItem, incomeTypeEarnedLabels);
  });

  describe('recipient pages', () => {
    describe('Veteran recipient page', () => {
      const formData = { ...testData.data, claimantType: 'VETERAN' };

      it('should display when claimantType is VETERAN', () => {
        const { depends } = associatedIncomeVeteranRecipientPage;
        expect(depends(formData)).to.be.true;
      });
    });

    describe('Spouse recipient page', () => {
      const formData = { ...testData.data, claimantType: 'SPOUSE' };

      it('should display when claimantType is SPOUSE', () => {
        const { depends } = associatedIncomeSpouseRecipientPage;
        expect(depends(formData)).to.be.true;
      });
    });

    describe('Custodian recipient page', () => {
      const formData = { ...testData.data, claimantType: 'CUSTODIAN' };

      it('should display when claimantType is CUSTODIAN', () => {
        const { depends } = associatedIncomeCustodianRecipientPage;
        expect(depends(formData)).to.be.true;
      });
    });

    describe('Parent recipient page', () => {
      const formData = { ...testData.data, claimantType: 'PARENT' };

      it('should display when claimantType is PARENT', () => {
        const { depends } = associatedIncomeParentRecipientPage;
        expect(depends(formData)).to.be.true;
      });
    });

    describe('Income recipient pages', () => {
      const formData = { ...testData.data, claimantType: 'CHILD' };

      it('should NOT display any recipient pages when claimantType is CHILD', () => {
        expect(associatedIncomeVeteranRecipientPage.depends(formData)).to.be
          .false;
        expect(associatedIncomeSpouseRecipientPage.depends(formData)).to.be
          .false;
        expect(associatedIncomeCustodianRecipientPage.depends(formData)).to.be
          .false;
        expect(associatedIncomeParentRecipientPage.depends(formData)).to.be
          .false;
      });
    });
  });

  describe('recipient name page', () => {
    const schema =
      associatedIncomeRecipientNamePage.schema.properties.associatedIncomes
        .items;
    const uiSchema =
      associatedIncomeRecipientNamePage.uiSchema.associatedIncomes.items;

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
      testData.data.associatedIncomes[0],
      { loggedIn: true },
    );

    it('should not show recipient name page when claimantType is CHILD', () => {
      const formData = { ...testData.data, claimantType: 'CHILD' };
      expect(associatedIncomeRecipientNamePage.depends(formData)).to.be.false;
    });
  });

  describe('child recipient name page', () => {
    const schema =
      associatedIncomeChildRecipientNamePage.schema.properties.associatedIncomes
        .items;
    const uiSchema =
      associatedIncomeChildRecipientNamePage.uiSchema.associatedIncomes.items;

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
      expect(associatedIncomeChildRecipientNamePage.depends(formData)).to.be
        .true;
    });

    it('should not show child recipient name page when claimantType is not CHILD', () => {
      const formData = { ...testData.data, claimantType: 'SPOUSE' };
      expect(associatedIncomeChildRecipientNamePage.depends(formData)).to.be
        .false;
    });
  });

  describe('income type page', () => {
    const schema =
      associatedIncomeTypePage.schema.properties.associatedIncomes.items;
    const uiSchema = associatedIncomeTypePage.uiSchema.associatedIncomes.items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 1, 'va-text-input': 3 },
      'income type',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      [
        'va-radio[label="What type of income is generated by this financial account?"]',
        'va-text-input[label="What’s the gross monthly income from this financial account?"]',
        'va-text-input[label="What’s the current value of the account?"]',
        'va-text-input[label="Who pays the income?"]',
      ],
      'income type',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'income type',
      testData.data.associatedIncomes[0],
      { loggedIn: true },
    );
  });
});
