import { expect } from 'chai';

import { FORMAT_YMD_DATE_FNS, FORMAT_READABLE_DATE_FNS } from '../../constants';
import {
  fixDateFormat,
  parseDateToDateObj,
  parseDate,
  parseDateWithOffset,
  getReadableDate,
  getCurrentUTCStartOfDay,
  toUTCStartOfDay,
  isLocalToday,
  isUTCTodayOrFuture,
  formatDateToReadableString,
} from '../../utils/dates';

describe('parseDateToDateObj', () => {
  const dateString = '2021-02-10';
  const dateIsoString = '2021-02-10T00:00:00';
  const result = 'Wed Feb 10 2021';

  it('should return null', () => {
    expect(parseDateToDateObj('', FORMAT_YMD_DATE_FNS)).to.be.null;
    expect(parseDateToDateObj('T', FORMAT_YMD_DATE_FNS)).to.be.null;
    expect(parseDateToDateObj(new Date('abcd'))).to.be.null;
  });

  it('should start with a date object and return a date object with timezone adjustments', () => {
    expect(parseDateToDateObj(new Date(dateString)).toString()).to.contain(
      result,
    );
    expect(parseDateToDateObj(new Date(dateIsoString)).toString()).to.contain(
      result,
    );
  });

  it('should start with a date string and return a date object', () => {
    expect(parseDateToDateObj(dateIsoString).toString()).to.contain(result);
    // Adding a format template fixes the problem
    expect(
      parseDateToDateObj(dateString, FORMAT_YMD_DATE_FNS).toString(),
    ).to.contain(result);
    expect(
      parseDateToDateObj(
        'February 10, 2021',
        FORMAT_READABLE_DATE_FNS,
      ).toString(),
    ).to.contain(result);
  });
});

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
    expect(parseDate(1712854521628)).to.eq('2024-04-11');
    // one off date example if you don't include the time
    expect(parseDate(new Date('2024-05-06T00:00:00.000'))).to.eq('2024-05-06');
    expect(parseDate('2023-06-17T12:34:56.000-06:00')).to.eq('2023-06-17');
    expect(parseDate(1712854521628, FORMAT_READABLE_DATE_FNS)).to.eq(
      'April 11, 2024',
    );
    // Non-ISO8601 format example
    expect(
      parseDate('2024-02-03', FORMAT_READABLE_DATE_FNS, FORMAT_YMD_DATE_FNS),
    ).to.eq('February 3, 2024');
    // one off date example if you don't include the time
    expect(
      parseDate(new Date('2024-05-06T00:00:00.000'), FORMAT_READABLE_DATE_FNS),
    ).to.eq('May 6, 2024');
    expect(
      parseDate('2023-06-17T12:34:56.000-06:00', FORMAT_READABLE_DATE_FNS),
    ).to.eq('June 17, 2023');
  });
});

describe('parseDateWithOffset', () => {
  it('should return null', () => {
    expect(parseDateWithOffset({}, '')).to.be.null;
    expect(parseDateWithOffset({ months: 1 }, '')).to.be.null;
    expect(parseDateWithOffset({ months: 1 }, new Date('abcd'))).to.be.null;
  });
  it('should return a date string from offset settings', () => {
    const date = new Date('2024-01-01');
    expect(parseDateWithOffset({}, date)).to.contain('2024-01-01');
    expect(parseDateWithOffset({ years: -1 }, date)).to.contain('2023-01-01');
    expect(parseDateWithOffset({ years: 1 }, date)).to.contain('2025-01-01');
    expect(
      parseDateWithOffset({ months: -1 }, date, FORMAT_READABLE_DATE_FNS),
    ).to.contain('December 1, 2023');
    expect(
      parseDateWithOffset(
        { days: 3, months: 1 },
        date,
        FORMAT_READABLE_DATE_FNS,
      ),
    ).to.contain('February 4, 2024');
  });
});

describe('getReadableDate', () => {
  it('should return null', () => {
    expect(getReadableDate('')).to.be.null;
    expect(getReadableDate('2022')).to.be.null;
    expect(getReadableDate('2023-03')).to.be.null;
  });
  it('should return a readable date', () => {
    expect(getReadableDate('2023-10-15')).to.eq('October 15, 2023');
    expect(getReadableDate('2024-06-04')).to.eq('June 4, 2024');
  });
});

describe('getCurrentUTCStartOfDay', () => {
  it('should return current date in UTC at start of day (midnight)', () => {
    const result = getCurrentUTCStartOfDay();
    const now = new Date();

    expect(result).to.be.instanceOf(Date);
    expect(result.getTime()).to.not.be.NaN;

    expect(result.getUTCFullYear()).to.equal(now.getUTCFullYear());
    expect(result.getUTCMonth()).to.equal(now.getUTCMonth());
    expect(result.getUTCDate()).to.equal(now.getUTCDate());

    expect(result.getUTCHours()).to.equal(0);
    expect(result.getUTCMinutes()).to.equal(0);
    expect(result.getUTCSeconds()).to.equal(0);
    expect(result.getUTCMilliseconds()).to.equal(0);
  });
});

describe('toUTCStartOfDay', () => {
  it('should convert local date to UTC start of day preserving calendar date', () => {
    const inputDate = new Date('2023-10-15T14:30:45.123');
    const result = toUTCStartOfDay(inputDate);

    expect(result.getUTCFullYear()).to.equal(inputDate.getFullYear());
    expect(result.getUTCMonth()).to.equal(inputDate.getMonth());
    expect(result.getUTCDate()).to.equal(inputDate.getDate());

    expect(result.getUTCHours()).to.equal(0);
    expect(result.getUTCMinutes()).to.equal(0);
    expect(result.getUTCSeconds()).to.equal(0);
    expect(result.getUTCMilliseconds()).to.equal(0);
  });

  it('should handle dates at start and end of day', () => {
    const startOfDay = new Date('2023-10-15T00:00:00.000');
    const endOfDay = new Date('2023-10-15T23:59:59.999');

    const result1 = toUTCStartOfDay(startOfDay);
    const result2 = toUTCStartOfDay(endOfDay);

    expect(result1.getTime()).to.equal(result2.getTime());
    expect(result1.getUTCHours()).to.equal(0);
    expect(result2.getUTCHours()).to.equal(0);
  });

  it('should handle different input date formats consistently', () => {
    // Use local timezone dates to avoid timezone parsing issues
    const date1 = new Date(2023, 9, 15, 10, 0, 0); // October 15, 2023 10:00 AM local
    const date2 = new Date(2023, 9, 15, 23, 59, 59); // October 15, 2023 11:59 PM local
    const date3 = new Date(2023, 9, 15, 0, 0, 0); // October 15, 2023 midnight local

    const result1 = toUTCStartOfDay(date1);
    const result2 = toUTCStartOfDay(date2);
    const result3 = toUTCStartOfDay(date3);

    expect(result1.getTime()).to.equal(result2.getTime());
    expect(result2.getTime()).to.equal(result3.getTime());
    expect(result1.getUTCDate()).to.equal(15);
  });
});

describe('isLocalToday', () => {
  it("should return true for today's date", () => {
    const today = new Date();
    expect(isLocalToday(today)).to.be.true;
  });

  it('should return false for yesterday', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(isLocalToday(yesterday)).to.be.false;
  });

  it('should return false for tomorrow', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    expect(isLocalToday(tomorrow)).to.be.false;
  });
});

describe('isUTCTodayOrFuture', () => {
  it('should return true for today in UTC', () => {
    const today = new Date();
    expect(isUTCTodayOrFuture(today)).to.be.true;
  });

  it('should return true for future dates', () => {
    const future = new Date();
    future.setDate(future.getDate() + 1);
    expect(isUTCTodayOrFuture(future)).to.be.true;
  });

  it('should return false for past dates', () => {
    const past = new Date();
    past.setDate(past.getDate() - 1);
    expect(isUTCTodayOrFuture(past)).to.be.false;
  });

  it('should handle same UTC day comparison correctly', () => {
    // Test the specific UTC comparison logic used by isUTCTodayOrFuture
    // This verifies the core algorithm: issueDateUtc.getTime() >= utcToday.getTime()

    const mockUTCToday = new Date(Date.UTC(2024, 0, 15, 0, 0, 0, 0)); // Jan 15, 2024 UTC start
    const decisionDate = new Date(Date.UTC(2024, 0, 15, 8, 0, 0, 0)); // Jan 15, 2024 8 AM UTC

    const issueDateUTC = toUTCStartOfDay(decisionDate);
    const utcComparisonResult =
      issueDateUTC.getTime() >= mockUTCToday.getTime();

    expect(utcComparisonResult).to.be.true;
    expect(issueDateUTC.getUTCDate()).to.equal(mockUTCToday.getUTCDate());
    expect(issueDateUTC.getTime()).to.equal(mockUTCToday.getTime());
  });
});

describe('formatDateToReadableString', () => {
  describe('VA.gov style month formatting', () => {
    it('should NOT abbreviate March per VA.gov style guide', () => {
      const marchDate = new Date(2025, 2, 15, 12, 0, 0); // March 15, 2025
      const result = formatDateToReadableString(marchDate);
      expect(result).to.equal('March 15, 2025');
    });

    it('should abbreviate December with period per VA.gov style guide', () => {
      const decemberDate = new Date(2025, 11, 10, 12, 0, 0); // December 10, 2025
      const result = formatDateToReadableString(decemberDate);
      expect(result).to.equal('Dec. 10, 2025');
    });
  });
});

describe('fixDateFormat', () => {
  it('should return an empty strings for empty or non-string values', () => {
    expect(fixDateFormat()).to.eq('');
    expect(fixDateFormat('')).to.eq('');
    expect(fixDateFormat({})).to.eq('');
    expect(fixDateFormat(null)).to.eq('');
    expect(fixDateFormat(10)).to.eq('');
  });
  it('should return invalid dates strings', () => {
    expect(fixDateFormat('-')).to.eq('-00-00');
    expect(fixDateFormat('200')).to.eq('200-00-00');
  });
  it('should return already properly formatted date string', () => {
    expect(fixDateFormat('2020-01-02')).to.eq('2020-01-02');
    expect(fixDateFormat('2023-12-31')).to.eq('2023-12-31');
    expect(fixDateFormat('2000-06-30')).to.eq('2000-06-30');
  });
  it('should return properly formatted date string when passed dates with no leading zero', () => {
    expect(fixDateFormat('2020-1-2')).to.eq('2020-01-02');
    expect(fixDateFormat('2023-10-1')).to.eq('2023-10-01');
    expect(fixDateFormat('2000-6-30')).to.eq('2000-06-30');
  });
  it('should return properly formatted date string when passed dates with weird spacing', () => {
    expect(fixDateFormat('2020--')).to.eq('2020-00-00');
    expect(fixDateFormat('2020-1-')).to.eq('2020-01-00');
    expect(fixDateFormat('2020- 1 - 2 ')).to.eq('2020-01-02');
    expect(fixDateFormat('2023 - 10 - 1')).to.eq('2023-10-01');
    expect(fixDateFormat('2000-6 - 30')).to.eq('2000-06-30');
    expect(fixDateFormat('2000  -  6 - 30')).to.eq('2000-06-30');
    expect(fixDateFormat('2000 \t - \t 6 \t - \t 30')).to.eq('2000-06-30');
  });
});
