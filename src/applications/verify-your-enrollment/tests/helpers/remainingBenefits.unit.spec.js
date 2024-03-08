import { expect } from 'chai';
import { remainingBenefits } from '../../helpers';

describe('remainingBenefits', () => {
  it('should correctly process rremaining Benefits', () => {
    const remEnt = '285432';
    const result = remainingBenefits(remEnt);

    expect(result).to.deep.equal({ month: 28, day: 16 });
  });
});
