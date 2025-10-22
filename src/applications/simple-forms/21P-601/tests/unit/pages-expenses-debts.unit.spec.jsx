import { expect } from 'chai';

import expensesClaim from '../../pages/expensesClaim';
import expensesList from '../../pages/expensesList';
import otherDebts from '../../pages/otherDebts';
import otherDebtsList from '../../pages/otherDebtsList';
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

  describe('expensesList', () => {
    it('exports uiSchema and schema', () => {
      expect(expensesList).to.have.property('uiSchema');
      expect(expensesList).to.have.property('schema');
    });

    it('has expenses field', () => {
      expect(expensesList.uiSchema).to.have.property('expenses');
      expect(expensesList.schema.properties).to.have.property('expenses');
    });

    it('has viewField function', () => {
      const { viewField } = expensesList.uiSchema.expenses['ui:options'];
      expect(viewField).to.be.a('function');
      const result = viewField({
        formData: {
          provider: 'Test Hospital',
          expenseType: 'Medical',
          amount: '1000',
        },
      });
      expect(result).to.exist;
    });

    it('viewField handles missing data', () => {
      const { viewField } = expensesList.uiSchema.expenses['ui:options'];
      const result = viewField({
        formData: {
          provider: null,
          expenseType: null,
          amount: null,
        },
      });
      expect(result).to.exist;
    });

    it('has amount field with required option', () => {
      const amountOptions =
        expensesList.uiSchema.expenses.items.amount['ui:options'];
      expect(amountOptions).to.exist;
      expect(amountOptions.required).to.be.a('function');
      expect(amountOptions.required()).to.be.true;
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

  describe('otherDebtsList', () => {
    it('exports uiSchema and schema', () => {
      expect(otherDebtsList).to.have.property('uiSchema');
      expect(otherDebtsList).to.have.property('schema');
    });

    it('has otherDebts field', () => {
      expect(otherDebtsList.uiSchema).to.have.property('otherDebts');
      expect(otherDebtsList.schema.properties).to.have.property('otherDebts');
    });

    it('has viewField function', () => {
      const { viewField } = otherDebtsList.uiSchema.otherDebts['ui:options'];
      expect(viewField).to.be.a('function');
      const result = viewField({
        formData: {
          debtType: 'Credit Card',
          debtAmount: '5000',
        },
      });
      expect(result).to.exist;
    });

    it('viewField handles missing data', () => {
      const { viewField } = otherDebtsList.uiSchema.otherDebts['ui:options'];
      const result = viewField({
        formData: {
          debtType: null,
          debtAmount: null,
        },
      });
      expect(result).to.exist;
    });

    it('has debtAmount field with required option', () => {
      const amountOptions =
        otherDebtsList.uiSchema.otherDebts.items.debtAmount['ui:options'];
      expect(amountOptions).to.exist;
      expect(amountOptions.required).to.be.a('function');
      expect(amountOptions.required()).to.be.true;
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
