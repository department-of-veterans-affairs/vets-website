import { expect } from 'chai';
import { durationInDays } from '../../utils/helpers';

describe('durationInDays', () => {
  it('should return correct number of days between two dates', () => {
    const startDate = '2024-01-01';
    const endDate = '2024-01-31';
    const result = durationInDays(startDate, endDate);
    expect(result).to.equal(30);
  });

  it('should handle same start and end date', () => {
    const startDate = '2024-06-15';
    const endDate = '2024-06-15';
    const result = durationInDays(startDate, endDate);
    expect(result).to.equal(0);
  });

  it('should handle end date before start date', () => {
    const startDate = '2024-12-01';
    const endDate = '2024-11-30';
    const result = durationInDays(startDate, endDate);
    expect(result).to.equal(-1);
  });
});
