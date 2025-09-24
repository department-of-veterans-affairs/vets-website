import { expect } from 'chai';
import { getShowRefillHistory } from '../../../util/helpers';

describe('getShowRefillHistory function', () => {
  it('should return false when refill history is an empty array', () => {
    const refillHistory = [];
    expect(getShowRefillHistory(refillHistory)).to.equal(false);
  });

  it('should return false when refill history is 1 element with dispensedDate undefined', () => {
    const refillHistory = [{ dispensedDate: undefined }];
    expect(getShowRefillHistory(refillHistory)).to.equal(false);
  });

  it('should return true when refill history is 1 element with dispensed date undefined', () => {
    const refillHistory = [{ dispensedDate: '2023-08-04T04:00:00.000Z' }];
    expect(getShowRefillHistory(refillHistory)).to.equal(true);
  });

  it('should return true when refill history is 2 elements', () => {
    const refillHistory = [{}, {}];
    expect(getShowRefillHistory(refillHistory)).to.equal(true);
  });
});
