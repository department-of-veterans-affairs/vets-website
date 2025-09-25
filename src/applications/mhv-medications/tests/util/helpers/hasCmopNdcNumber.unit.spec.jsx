import { expect } from 'chai';
import { hasCmopNdcNumber } from '../../../util/helpers';

describe('hasCmopNdcNumber function', () => {
  it('should return true when at least one refill record has a cmopNdcNumber', () => {
    const refillHistory = [
      { cmopNdcNumber: null },
      { cmopNdcNumber: '12345-6789-01' },
      { cmopNdcNumber: null },
    ];
    expect(hasCmopNdcNumber(refillHistory)).to.equal(true);
  });

  it('should return false when no refill records have a cmopNdcNumber', () => {
    const refillHistory = [
      { cmopNdcNumber: null },
      { cmopNdcNumber: '' },
      { cmopNdcNumber: undefined },
    ];
    expect(hasCmopNdcNumber(refillHistory)).to.equal(false);
  });

  it('should return false when refill history is an empty array', () => {
    const refillHistory = [];
    expect(hasCmopNdcNumber(refillHistory)).to.equal(false);
  });
});
