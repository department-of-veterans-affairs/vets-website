import { expect } from 'chai';
import { deductionCodes } from '../const/deduction-codes';

describe('ResolveDebtPage', () => {
  it('should map deduction codes correctly', () => {
    expect(deductionCodes['30']).to.equal(
      'Disability compensation and pension overpayment',
    );
  });
});
