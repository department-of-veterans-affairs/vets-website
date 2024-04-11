import { expect } from 'chai';
import moment from 'moment';

import { FORMAT_YMD, FORMAT_READABLE } from '../../constants';
import { parseDate, getDate } from '../../utils/dates';

describe('parseDate', () => {
  it('should return null for invalid dates', () => {
    expect(parseDate('')).to.be.null;
    expect(parseDate({})).to.be.null;
    expect(parseDate('abcd')).to.be.null;
    expect(parseDate('2024-13-32')).to.be.null;
    expect(parseDate('2024-13-32T00:00:00.000-06:00')).to.be.null;
    expect(parseDate('1712854521628')).to.be.null;
  });
  it('should return a formatted date string', () => {
    expect(parseDate(2024)).to.eq('December 31, 1969');
    expect(parseDate(1712854521628)).to.eq('April 11, 2024');
    expect(parseDate('2024-02-03')).to.eq('February 3, 2024');
    // one off date example if you don't include the time
    expect(parseDate(new Date('2024-05-06T00:00:00.000'))).to.eq('May 6, 2024');
    expect(parseDate('2023-06-17T12:34:56.000-06:00')).to.eq('June 17, 2023');
  });
  it('should return a formatted date string', () => {
    const shortDate = 'MM-dd-yyyy';
    expect(parseDate(2024, shortDate)).to.eq('12-31-1969');
    expect(parseDate(1712854521628, shortDate)).to.eq('04-11-2024');
    expect(parseDate('2024-02-03', shortDate)).to.eq('02-03-2024');
    // one off date example if you don't include the time
    expect(parseDate(new Date('2024-05-06T00:00:00.000'), shortDate)).to.eq(
      '05-06-2024',
    );
    expect(parseDate('2023-06-17T12:34:56.000-06:00', shortDate)).to.eq(
      '06-17-2023',
    );
  });
});

describe.skip('getDate', () => {
  const dateString = '2021-02-10 00:00:00';
  const date = new Date(dateString);

  it('should return a date string from date object', () => {
    expect(getDate()).to.equal(moment().format(FORMAT_YMD));
  });
  it('should return a date string from date string & offset', () => {
    expect(getDate({ date, offset: { days: 3 } })).to.contain('2021-02-13');
  });
  it('should return a date string pattern based on date & offset', () => {
    expect(getDate({ date, offset: { years: -1 } })).to.contain('2020-02-10');
    expect(
      getDate({
        date,
        offset: { years: -1 },
        pattern: FORMAT_READABLE,
      }),
    ).to.contain('February 10, 2020');
    expect(
      getDate({ date: '2021-02-10 00:00:00', pattern: FORMAT_READABLE }),
    ).to.contain('February 10, 2021');
  });
});
