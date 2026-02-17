import { expect } from 'chai';
import sinon from 'sinon';
import formConfig from '../../../../config/form';
import {
  unassociatedIncomePages,
  options,
} from '../../../../config/chapters/02-unassociated-incomes/unassociatedIncomePages';
import { incomeTypeLabels } from '../../../../labels';
import * as helpers from '../../../../helpers';
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
  testSelectAndValidateField,
  testSubmitsWithoutErrors,
} from '../pageTests.spec';

describe('unassociated income list and loop pages', () => {
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
    unassociatedIncomePagesSummary,
    unassociatedIncomeNonVeteranRecipientPage,
    unassociatedIncomeVeteranRecipientPage,
    unassociatedIncomeSpouseRecipientPage,
    unassociatedIncomeCustodianRecipientPage,
    unassociatedIncomeParentRecipientPage,
    unassociatedIncomeChildRecipientNamePage,
    unassociatedIncomeRecipientNamePage,
  } = unassociatedIncomePages;

  describe('isItemIncomplete function', () => {
    const baseItem = testData.data.unassociatedIncomes[0];
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

  describe('MVP summary page', () => {
    beforeEach(() => {
      showUpdatedContentStub.returns(false);
    });

    const { schema, uiSchema } = unassociatedIncomePagesSummary;

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
        'va-radio[label="Are you or your dependents receiving or expecting to receive any income in the next 12 months from sources not related to an account or your assets?"]',
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

  describe('MVP income recipient page', () => {
    beforeEach(() => {
      showUpdatedContentStub.returns(false);
    });

    const schema =
      unassociatedIncomeNonVeteranRecipientPage.schema.properties
        .unassociatedIncomes.items;
    const uiSchema =
      unassociatedIncomeNonVeteranRecipientPage.uiSchema.unassociatedIncomes
        .items;

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
      testData.data.unassociatedIncomes[0],
      { loggedIn: true },
    );
    testSelectAndValidateField(
      formConfig,
      schema,
      uiSchema,
      'recipient',
      'root_otherRecipientRelationshipType',
    );

    describe('Non-Veteran recipient page', () => {
      it('should display when showUpdatedContent is false', () => {
        const formData = { ...testData.data, claimantType: 'SPOUSE' };
        const { depends } = unassociatedIncomeNonVeteranRecipientPage;
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
        expect(unassociatedIncomeNonVeteranRecipientPage.depends(formData)).to
          .be.false;
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
    beforeEach(() => {
      showUpdatedContentStub.returns(false);
    });

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
      testData.data.unassociatedIncomes[0],
      { loggedIn: true },
    );

    it('should show recipient name page when claimantType is not CHILD', () => {
      const formData = { ...testData.data, claimantType: 'SPOUSE' };
      expect(unassociatedIncomeRecipientNamePage.depends(formData)).to.be.true;
    });

    it('should not show recipient name page when claimantType is CHILD', () => {
      showUpdatedContentStub.returns(true);
      const formData = { ...testData.data, claimantType: 'CHILD' };
      expect(unassociatedIncomeRecipientNamePage.depends(formData)).to.be.false;
    });
  });

  describe('child recipient name page', () => {
    beforeEach(() => {
      showUpdatedContentStub.returns(true);
    });

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
        'va-text-input[label="Income recipient’s first or given name"]',
        'va-text-input[label="Income recipient’s last or family name"]',
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
        'va-radio[label="What is the type of income?"]',
        'va-text-input[label="Gross monthly income"]',
        'va-text-input[label="Income payer name"]',
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
