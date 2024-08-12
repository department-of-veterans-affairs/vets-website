import { expect } from 'chai';
import { getEndOfMonth } from '../../helpers';

describe('getEndOfMonth', () => {
  it('should get the last day of the month', () => {
    const result = getEndOfMonth('2021', '3');
    expect(result).to.equal(31);
  });
});
