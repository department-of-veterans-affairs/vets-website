import { expect } from 'chai';
import { canHaveEducationExpenses } from '../../../../utils/helpers';

describe('hca household section helpers', () => {
  context('hca `canHaveEducationExpenses` executes', () => {
    it('should return `false` when birthdate is greater than 23 years from testdate', () => {
      const formData = {
        dateOfBirth: '1986-06-01',
        'view:grossIncome': { grossIncome: '1000' },
      };
      const testdate = new Date('2023-06-01');
      expect(canHaveEducationExpenses(formData, testdate)).to.be.false;
    });

    it('should return `false` when birthdate is less than 18 years from testdate', () => {
      const formData = {
        dateOfBirth: '2005-06-02',
        'view:grossIncome': { grossIncome: '1000' },
      };
      const testdate = new Date('2023-06-01');
      expect(canHaveEducationExpenses(formData, testdate)).to.be.false;
    });

    it('should return `true` when birthdate is exactly 18 years from testdate', () => {
      const formData = {
        dateOfBirth: '2005-06-01',
        'view:grossIncome': { grossIncome: '1000' },
      };
      const testdate = new Date('2023-06-01');
      expect(canHaveEducationExpenses(formData, testdate)).to.be.true;
    });

    it('should return `true` when birthdate is exactly 23 years from testdate', () => {
      const formData = {
        dateOfBirth: '2000-06-01',
        'view:grossIncome': { grossIncome: '1000' },
      };
      const testdate = new Date('2023-06-01');
      expect(canHaveEducationExpenses(formData, testdate)).to.be.true;
    });

    it('should return `true` when birthdate is between 18 and 23 years from testdate', () => {
      const formData = {
        dateOfBirth: '2003-06-01',
        'view:grossIncome': { grossIncome: '1000' },
      };
      const testdate = new Date('2023-06-01');
      expect(canHaveEducationExpenses(formData, testdate)).to.be.true;
    });

    it('should return `false` when no income is declared', () => {
      const formData = { dateOfBirth: '2003-06-01' };
      const testdate = new Date('2023-06-01');
      expect(canHaveEducationExpenses(formData, testdate)).to.be.false;
    });

    it('should return `false` when gross income is `0`', () => {
      const formData = {
        dateOfBirth: '2003-06-01',
        'view:grossIncome': { grossIncome: 0 },
      };
      const testdate = new Date('2023-06-01');
      expect(canHaveEducationExpenses(formData, testdate)).to.be.false;
    });
  });
});
