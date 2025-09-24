import { expect } from 'chai';
import { fromToNumbs } from '../../../util/helpers';

describe('fromToNumbs', () => {
  it('should return [0, 0]', () => {
    const numbers = fromToNumbs(1, 0, [], 1);
    expect(numbers[0]).to.eq(0);
    expect(numbers[1]).to.eq(0);
  });

  it('should return [1, 2]', () => {
    const numbers = fromToNumbs(1, 2, [1, 2], 2);
    expect(numbers[0]).to.eq(1);
    expect(numbers[1]).to.eq(2);
  });
});
