import { expect } from 'chai';

import { isSameMonth } from '../../helpers';

describe('isSameMonth', () => {
  it('should returns true for dates in the same month and year and diffrent day', () => {
    const date1 = '2024-05-01';
    const date2 = '2024-05-27';
    const result = isSameMonth(date1, date2);
    expect(result).to.be.true;
  });

  it('should returns false for dates in different months of the same year and diffrent day', () => {
    const date1 = '2024-05-04';
    const date2 = '2024-06-01';
    const result = isSameMonth(date1, date2);
    expect(result).to.be.false;
  });

  it('should returns false for dates in the same month of different years diffrent day', () => {
    const date1 = '2023-05-03';
    const date2 = '2024-05-30';
    const result = isSameMonth(date1, date2);
    expect(result).to.be.false;
  });

  it('should returns false for completely different dates', () => {
    const date1 = '2023-04-09';
    const date2 = '2024-05-30';
    const result = isSameMonth(date1, date2);
    expect(result).to.be.false;
  });

  it('should handles invalid date formats gracefully', () => {
    const date1 = 'invalid-date';
    const date2 = '2024-05-08';
    const result = isSameMonth(date1, date2);
    expect(result).to.be.false;
  });
});
