import { expect } from 'chai';

import { FORMAT_FULL_DATE, FORMAT_YMD_DATE_FNS } from '../../constants';
import { parseDate } from '../../utils/dates';

describe('parseDate', () => {
  it('should return null for invalid dates', () => {
    expect(parseDate('')).to.be.null;
    expect(parseDate({})).to.be.null;
    expect(parseDate('abcd')).to.be.null;
    expect(parseDate('2024-13-32')).to.be.null;
    expect(parseDate('2024-13-32T00:00:00.000-06:00')).to.be.null;
    expect(parseDate('1712854521628')).to.be.null;
    expect(parseDate('2000-1-1')).to.be.null; // Non-ISO8601 format without passing in current format
    expect(parseDate('02-03-2024')).to.be.null; // Non-ISO8601 format without passing in current format
  });
  it('should return a formatted date string', () => {
    expect(parseDate(2024, FORMAT_FULL_DATE)).to.eq('December 31, 1969');
    expect(parseDate(1712854521628, FORMAT_FULL_DATE)).to.eq('April 11, 2024');
    // Non-ISO8601 format example
    expect(
      parseDate('2024-02-03', FORMAT_FULL_DATE, FORMAT_YMD_DATE_FNS),
    ).to.eq('February 3, 2024');
    // one off date example if you don't include the time
    expect(
      parseDate(new Date('2024-05-06T00:00:00.000'), FORMAT_FULL_DATE),
    ).to.eq('May 6, 2024');
    expect(parseDate('2023-06-17T12:34:56.000-06:00', FORMAT_FULL_DATE)).to.eq(
      'June 17, 2023',
    );
  });
  it('should return a formatted date string', () => {
    expect(parseDate(2024)).to.eq('1969-12-31');
    expect(parseDate(1712854521628)).to.eq('2024-04-11');
    // one off date example if you don't include the time
    expect(parseDate(new Date('2024-05-06T00:00:00.000'))).to.eq('2024-05-06');
    expect(parseDate('2023-06-17T12:34:56.000-06:00')).to.eq('2023-06-17');
  });
});
