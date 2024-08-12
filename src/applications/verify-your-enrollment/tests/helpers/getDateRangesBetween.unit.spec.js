import { expect } from 'chai';
import { getDateRangesBetween } from '../../helpers';

describe('getDateRangesBetween', () => {
  it('should return the correct date ranges for a given range within the same month', () => {
    const date1 = '2024-05-02';
    const date2 = '2024-05-20';
    const ranges = getDateRangesBetween(date1, date2);
    expect(ranges).to.deep.equal([
      '2024-05-02 - 2024-05-31',
      '2024-05-01 - 2024-05-20',
    ]);
  });
});
