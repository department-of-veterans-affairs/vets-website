// Assuming you are using Mocha and Chai
import { expect } from 'chai';
import { translateDateIntoMonthYearFormat } from '../../helpers';

describe('translateDateIntoMonthYearFormat', () => {
  it('correctly formats a date string into "Month Year"', () => {
    // Tests with different dates
    expect(translateDateIntoMonthYearFormat('2023-01-1')).to.equal(
      'January 2023',
    );
    expect(translateDateIntoMonthYearFormat('2022-12-02')).to.equal(
      'December 2022',
    );
    expect(translateDateIntoMonthYearFormat('2021-06-30')).to.equal(
      'June 2021',
    );
  });
});
