import { expect } from 'chai';

import expensesClaim from '../../pages/expensesClaim';
import { expensesPages, expensesOptions } from '../../pages/expensesList';
import otherDebts from '../../pages/otherDebts';
import { otherDebtsPages, otherDebtsOptions } from '../../pages/otherDebtsList';
import remarks from '../../pages/remarks';

describe('21P-601 expenses and debts page configurations', () => {
  describe('expensesClaim', () => {
    it('exports uiSchema and schema', () => {
      expect(expensesClaim).to.have.property('uiSchema');
      expect(expensesClaim).to.have.property('schema');
    });

    it('has claimingReimbursement field', () => {
      expect(expensesClaim.schema.properties).to.have.property(
        'claimingReimbursement',
      );
    });

    it('requires claimingReimbursement', () => {
      expect(expensesClaim.schema.required).to.include('claimingReimbursement');
    });
  });

  describe('expensesList (array builder)', () => {
    it('exports array builder pages object', () => {
      expect(expensesPages).to.be.an('object');
      expect(expensesPages).to.have.property('expensesSummary');
      expect(expensesPages).to.have.property('expenseDetailsPage');
      expect(expensesPages).to.have.property('expensePaidByPage');
    });

    it('summary page has correct structure', () => {
      expect(expensesPages.expensesSummary).to.have.property('path');
      expect(expensesPages.expensesSummary.path).to.equal('expenses-list');
      expect(expensesPages.expensesSummary).to.have.property('uiSchema');
      expect(expensesPages.expensesSummary).to.have.property('schema');
    });

    it('summary page has required schema property', () => {
      expect(expensesPages.expensesSummary.schema.properties).to.have.property(
        'view:hasExpenses',
      );
      expect(expensesPages.expensesSummary.schema.required).to.include(
        'view:hasExpenses',
      );
    });

    it('summary page has array builder UI', () => {
      expect(expensesPages.expensesSummary.uiSchema).to.have.property(
        'view:hasExpenses',
      );
    });

    it('summary page has info alert', () => {
      expect(expensesPages.expensesSummary.uiSchema).to.have.property(
        'view:expenseInfo',
      );
    });

    it('expenseDetailsPage has correct path with index', () => {
      expect(expensesPages.expenseDetailsPage.path).to.include(':index');
      expect(expensesPages.expenseDetailsPage.path).to.include('details');
    });

    it('expenseDetailsPage has proper schema structure', () => {
      expect(
        expensesPages.expenseDetailsPage.schema.properties,
      ).to.have.property('expenses');
      const itemSchema =
        expensesPages.expenseDetailsPage.schema.properties.expenses.items;
      expect(itemSchema.properties).to.have.property('provider');
      expect(itemSchema.properties).to.have.property('expenseType');
      expect(itemSchema.properties).to.have.property('amount');
    });

    it('expenseDetailsPage requires provider, expenseType, and amount', () => {
      const itemSchema =
        expensesPages.expenseDetailsPage.schema.properties.expenses.items;
      expect(itemSchema.required).to.include('provider');
      expect(itemSchema.required).to.include('expenseType');
      expect(itemSchema.required).to.include('amount');
    });

    it('expensePaidByPage has correct path with index', () => {
      expect(expensesPages.expensePaidByPage.path).to.include(':index');
      expect(expensesPages.expensePaidByPage.path).to.include('paid-by');
    });

    it('expensePaidByPage has paidBy field', () => {
      expect(
        expensesPages.expensePaidByPage.schema.properties,
      ).to.have.property('expenses');
      const itemSchema =
        expensesPages.expensePaidByPage.schema.properties.expenses.items;
      expect(itemSchema.properties).to.have.property('paidBy');
    });

    it('all pages have title property', () => {
      expect(expensesPages.expensesSummary).to.have.property('title');
      expect(expensesPages.expenseDetailsPage).to.have.property('title');
      expect(expensesPages.expensePaidByPage).to.have.property('title');
    });

    it('calls isItemIncomplete', () => {
      expect(
        expensesOptions.isItemIncomplete({
          provider: null,
          expenseType: 'Medical',
          amount: '100',
        }),
      ).to.be.true;
      expect(
        expensesOptions.isItemIncomplete({
          provider: 'Hospital',
          expenseType: 'Medical',
          amount: '100',
        }),
      ).to.be.false;
    });

    it('calls getItemName with provider', () => {
      const result = expensesOptions.text.getItemName({
        provider: 'Test Hospital',
      });
      expect(result).to.equal('Test Hospital');
    });

    it('calls getItemName without provider', () => {
      const result = expensesOptions.text.getItemName({ provider: null });
      expect(result).to.equal('Unknown provider');
    });

    it('calls cardDescription with amount', () => {
      const result = expensesOptions.text.cardDescription({
        expenseType: 'Medical',
        amount: '1000.50',
      });
      expect(result).to.equal('Medical - $1000.50');
    });

    it('calls cardDescription without amount', () => {
      const result = expensesOptions.text.cardDescription({
        expenseType: 'Burial',
      });
      expect(result).to.equal('Burial - $0.00');
    });

    it('calls cardDescription without expenseType', () => {
      const result = expensesOptions.text.cardDescription({
        amount: '500',
      });
      expect(result).to.equal('Not specified - $500.00');
    });

    it('calls cardDescription with neither expenseType nor amount', () => {
      const result = expensesOptions.text.cardDescription({});
      expect(result).to.equal('Not specified - $0.00');
    });

    it('calls getItemName with undefined item', () => {
      const result = expensesOptions.text.getItemName(undefined);
      expect(result).to.equal('Unknown provider');
    });

    it('calls isItemIncomplete with missing expenseType', () => {
      expect(
        expensesOptions.isItemIncomplete({
          provider: 'Hospital',
          expenseType: null,
          amount: '100',
        }),
      ).to.be.true;
    });

    it('calls isItemIncomplete with missing amount', () => {
      expect(
        expensesOptions.isItemIncomplete({
          provider: 'Hospital',
          expenseType: 'Medical',
          amount: null,
        }),
      ).to.be.true;
    });

    it('calls isItemIncomplete with all fields missing', () => {
      expect(expensesOptions.isItemIncomplete({})).to.be.true;
    });

    it('calls isItemIncomplete with undefined item', () => {
      expect(expensesOptions.isItemIncomplete(undefined)).to.be.true;
    });

    it('expensePaidByPage title function returns title with provider', () => {
      const titleFn =
        expensesPages.expensePaidByPage.uiSchema.expenses.items['ui:title'];
      expect(titleFn).to.be.a('function');
      const result = titleFn({ formData: { provider: 'Test Hospital' } });
      expect(result).to.exist;
    });

    it('expensePaidByPage title function returns title without provider', () => {
      const titleFn =
        expensesPages.expensePaidByPage.uiSchema.expenses.items['ui:title'];
      expect(titleFn).to.be.a('function');
      const result = titleFn({ formData: {} });
      expect(result).to.exist;
    });

    it('expensePaidByPage title function returns title with null provider', () => {
      const titleFn =
        expensesPages.expensePaidByPage.uiSchema.expenses.items['ui:title'];
      expect(titleFn).to.be.a('function');
      const result = titleFn({ formData: { provider: null } });
      expect(result).to.exist;
    });

    it('expensePaidByPage title function returns title with undefined formData', () => {
      const titleFn =
        expensesPages.expensePaidByPage.uiSchema.expenses.items['ui:title'];
      expect(titleFn).to.be.a('function');
      const result = titleFn({ formData: undefined });
      expect(result).to.exist;
    });

    it('verifies maxItems is set to 4', () => {
      expect(expensesOptions.maxItems).to.equal(4);
    });

    it('verifies arrayPath is expenses', () => {
      expect(expensesOptions.arrayPath).to.equal('expenses');
    });

    it('verifies nounSingular is expense', () => {
      expect(expensesOptions.nounSingular).to.equal('expense');
    });

    it('verifies nounPlural is expenses', () => {
      expect(expensesOptions.nounPlural).to.equal('expenses');
    });

    it('verifies required is false', () => {
      expect(expensesOptions.required).to.equal(false);
    });
  });

  describe('otherDebts', () => {
    it('exports uiSchema and schema', () => {
      expect(otherDebts).to.have.property('uiSchema');
      expect(otherDebts).to.have.property('schema');
    });

    it('has hasOtherDebts field', () => {
      expect(otherDebts.schema.properties).to.have.property('hasOtherDebts');
    });

    it('has otherDebtsDescription field', () => {
      expect(otherDebts.schema.properties).to.have.property(
        'otherDebtsDescription',
      );
    });
  });

  describe('otherDebtsList (array builder)', () => {
    it('exports array builder pages object', () => {
      expect(otherDebtsPages).to.be.an('object');
      expect(otherDebtsPages).to.have.property('otherDebtsSummary');
      expect(otherDebtsPages).to.have.property('debtDetailsPage');
    });

    it('summary page has correct structure', () => {
      expect(otherDebtsPages.otherDebtsSummary).to.have.property('path');
      expect(otherDebtsPages.otherDebtsSummary.path).to.equal(
        'other-debts-list',
      );
      expect(otherDebtsPages.otherDebtsSummary).to.have.property('uiSchema');
      expect(otherDebtsPages.otherDebtsSummary).to.have.property('schema');
    });

    it('summary page has required schema property', () => {
      expect(
        otherDebtsPages.otherDebtsSummary.schema.properties,
      ).to.have.property('view:hasOtherDebts');
      expect(otherDebtsPages.otherDebtsSummary.schema.required).to.include(
        'view:hasOtherDebts',
      );
    });

    it('summary page has array builder UI', () => {
      expect(otherDebtsPages.otherDebtsSummary.uiSchema).to.have.property(
        'view:hasOtherDebts',
      );
    });

    it('debtDetailsPage has correct path with index', () => {
      expect(otherDebtsPages.debtDetailsPage.path).to.include(':index');
      expect(otherDebtsPages.debtDetailsPage.path).to.include('details');
    });

    it('debtDetailsPage has proper schema structure', () => {
      expect(
        otherDebtsPages.debtDetailsPage.schema.properties,
      ).to.have.property('otherDebts');
      const itemSchema =
        otherDebtsPages.debtDetailsPage.schema.properties.otherDebts.items;
      expect(itemSchema.properties).to.have.property('debtType');
      expect(itemSchema.properties).to.have.property('debtAmount');
      expect(itemSchema.properties).to.have.property('creditorName');
    });

    it('debtDetailsPage requires debtType and debtAmount', () => {
      const itemSchema =
        otherDebtsPages.debtDetailsPage.schema.properties.otherDebts.items;
      expect(itemSchema.required).to.include('debtType');
      expect(itemSchema.required).to.include('debtAmount');
    });

    it('all pages have title property', () => {
      expect(otherDebtsPages.otherDebtsSummary).to.have.property('title');
      expect(otherDebtsPages.debtDetailsPage).to.have.property('title');
    });

    it('calls isItemIncomplete', () => {
      expect(
        otherDebtsOptions.isItemIncomplete({
          debtType: null,
          debtAmount: '500',
        }),
      ).to.be.true;
      expect(
        otherDebtsOptions.isItemIncomplete({
          debtType: 'Credit Card',
          debtAmount: '500',
        }),
      ).to.be.false;
    });

    it('calls getItemName with debtType', () => {
      const result = otherDebtsOptions.text.getItemName({
        debtType: 'Personal Loan',
      });
      expect(result).to.equal('Personal Loan');
    });

    it('calls getItemName without debtType', () => {
      const result = otherDebtsOptions.text.getItemName({ debtType: null });
      expect(result).to.equal('Unknown debt');
    });

    it('calls cardDescription with amount', () => {
      const result = otherDebtsOptions.text.cardDescription({
        debtAmount: '2500.75',
      });
      expect(result).to.equal('Amount: $2500.75');
    });

    it('calls cardDescription without amount', () => {
      const result = otherDebtsOptions.text.cardDescription({
        debtType: 'Credit Card',
      });
      expect(result).to.equal('Amount: $0.00');
    });
  });

  describe('remarks', () => {
    it('exports uiSchema and schema', () => {
      expect(remarks).to.have.property('uiSchema');
      expect(remarks).to.have.property('schema');
    });

    it('has remarks field', () => {
      expect(remarks.uiSchema).to.have.property('remarks');
      expect(remarks.schema.properties).to.have.property('remarks');
    });

    it('does not require remarks', () => {
      expect(remarks.schema.required || []).to.not.include('remarks');
    });
  });
});
