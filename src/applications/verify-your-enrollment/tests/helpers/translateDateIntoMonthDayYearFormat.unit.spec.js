import { expect } from 'chai';
import { translateDateIntoMonthDayYearFormat } from '../../helpers';

describe('translateDateIntoMonthDayYearFormat', () => {
  it('correctly formats a date string into "Month DayOrdinal, Year"', () => {
    expect(translateDateIntoMonthDayYearFormat('2023-01-01')).to.equal(
      'January 1st, 2023',
    );
    expect(translateDateIntoMonthDayYearFormat('2022-02-02')).to.equal(
      'February 2nd, 2022',
    );
    expect(translateDateIntoMonthDayYearFormat('2021-03-03')).to.equal(
      'March 3rd, 2021',
    );
    expect(translateDateIntoMonthDayYearFormat('2023-04-04')).to.equal(
      'April 4th, 2023',
    );
    expect(translateDateIntoMonthDayYearFormat('2023-01-10')).to.equal(
      'January 10th, 2023',
    );
    expect(translateDateIntoMonthDayYearFormat('2023-01-25')).to.equal(
      'January 25th, 2023',
    );
  });
  it('should return null if value passed is null or undefind or empty string', () => {
    expect(translateDateIntoMonthDayYearFormat(null)).to.be.null;
    expect(translateDateIntoMonthDayYearFormat(undefined)).to.be.null;
    expect(translateDateIntoMonthDayYearFormat('')).to.be.null;
  });
});
