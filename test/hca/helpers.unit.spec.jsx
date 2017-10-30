import { expect } from 'chai';

import { expensesLessThanIncome } from '../../src/js/hca/helpers.jsx';

describe('HCA helpers', () => {
  describe('expensesLessThanIncome', () => {
    it('should return true if expenses less than income', () => {
      const formData = {
        veteranNetIncome: 3,
        deductibleMedicalExpenses: 2
      };

      expect(expensesLessThanIncome(formData)).to.be.true;
    });
    it('should return false if expenses greater than income', () => {
      const formData = {
        veteranNetIncome: 3,
        deductibleMedicalExpenses: 4
      };

      expect(expensesLessThanIncome(formData)).to.be.false;
    });
    it('should include income from dependents', () => {
      const formData = {
        deductibleMedicalExpenses: 2,
        dependents: [{
          grossIncome: 3
        }]
      };

      expect(expensesLessThanIncome(formData)).to.be.true;
    });
    it('should include spouse income', () => {
      const formData = {
        deductibleMedicalExpenses: 2,
        'view:spouseIncome': {
          spouseGrossIncome: 3
        }
      };

      expect(expensesLessThanIncome(formData)).to.be.true;
    });
  });
});

