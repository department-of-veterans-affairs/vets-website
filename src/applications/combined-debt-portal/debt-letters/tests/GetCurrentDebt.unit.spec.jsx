import { expect } from 'chai';
import { getCurrentDebt } from '../utils/page';

describe('getCurrentDebt', () => {
  it('should return an empty object if both selectedDebt and debts are empty', () => {
    const selectedDebt = {};
    const debts = [];
    const location = { pathname: '/debt/12345' };

    const result = getCurrentDebt(selectedDebt, debts, location);
    expect(result).to.deep.equal({});
  });

  it('should return selectedDebt if it is not empty', () => {
    const selectedDebt = { id: '1', amount: 100 };
    const debts = [];
    const location = { pathname: '/debt/12345' };

    const result = getCurrentDebt(selectedDebt, debts, location);
    expect(result).to.deep.equal(selectedDebt);
  });

  it('should return the debt that matches the compositeDebtId from the URL', () => {
    const selectedDebt = {};
    const debts = [
      { compositeDebtId: '12345', amount: 100 },
      { compositeDebtId: '67890', amount: 200 },
    ];
    const location = { pathname: '/debt/12345' };

    const result = getCurrentDebt(selectedDebt, debts, location);
    expect(result).to.deep.equal({ compositeDebtId: '12345', amount: 100 });
  });

  it('should return an empty object if no debt matches the compositeDebtId from the URL', () => {
    const selectedDebt = {};
    const debts = [{ compositeDebtId: '67890', amount: 200 }];
    const location = { pathname: '/debt/12345' };

    const result = getCurrentDebt(selectedDebt, debts, location);
    expect(result).to.deep.equal({});
  });
});
