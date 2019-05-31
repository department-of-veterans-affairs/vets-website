import { expect } from 'chai';
import { calculateRating } from '../../utils/helpers';

describe('Disabilty  Caclulator helper', () => {
  it('should calculate ', () => {
    const result = calculateRating([30, 20, 10]);
    expect(result).to.be.equal(50);
  });
});
