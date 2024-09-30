import { expect } from 'chai';
import moment from 'moment';
import { isValid, getDate, getMonth, getYear } from 'date-fns';

import {
  dateFieldToDate,
  formatDateLong,
  formatDateParsedZoneLong,
  formatDateParsedZoneShort,
  formatDateShort,
  formatDowntime,
  isValidDateString,
  parseStringOrDate,
  stripTimezoneFromIsoDate,
  timeFromNow,
} from '../date';

describe('Helpers unit tests', () => {
  describe('dateFieldToDate', () => {
    it('should convert date field to date', () => {
      const date = dateFieldToDate({
        month: {
          value: 2,
        },
        day: {
          value: 3,
        },
        year: {
          value: '1901',
        },
      });

      expect(isValid(date)).to.be.true;
      expect(getYear(date)).to.equal(1901);
      expect(getMonth(date)).to.equal(1);
      expect(getDate(date)).to.equal(3);
    });
    it('should convert partial date to date', () => {
      const date = dateFieldToDate({
        month: {
          value: 2,
        },
        year: {
          value: '1901',
        },
      });

      expect(isValid(date)).to.be.true;
      expect(getYear(date)).to.equal(1901);
      expect(getMonth(date)).to.equal(1);
      expect(getDate(date)).to.equal(1);
    });
  });

  describe('timeFromNow', () => {
    const today = moment().unix();
    it('should display time in days', () => {
      expect(
        timeFromNow(
          moment(today)
            .add(30, 'days')
            .toDate(),
          today,
        ),
      ).to.equal('30 days');
    });
    it('should display time in hours', () => {
      expect(
        timeFromNow(
          moment(today)
            .add(23, 'hours')
            .toDate(),
          today,
        ),
      ).to.equal('23 hours');
    });
    it('should display time in minutes', () => {
      expect(
        timeFromNow(
          moment(today)
            .add(59, 'minutes')
            .toDate(),
          today,
        ),
      ).to.equal('59 minutes');
    });
    it('should display time in seconds', () => {
      expect(
        timeFromNow(
          moment(today)
            .add(59, 'seconds')
            .toDate(),
          today,
        ),
      ).to.equal('59 seconds');
    });
  });

  describe('formatDateShort', () => {
    const noonString = '1995-11-12T12:00:00.000+0000';
    const noonDate = new Date(1995, 10, 12, 0, 0, 0, 0);
    const midnight = 1599112800000;

    it('should handle ISO strings', () => {
      expect(formatDateShort(noonString)).to.equal('11/12/1995');
    });

    it('should handle date objects', () => {
      expect(formatDateShort(noonDate)).to.equal('11/12/1995');
    });

    it('should handle unix timestamps with ms', () => {
      expect(formatDateShort(midnight)).to.equal('09/03/2020');
    });
  });

  describe('formatDateParsedZoneShort', () => {
    const midnight = '1995-11-12T00:00:00.000+0000';
    const midnightOffsetNegative1 = '1995-11-12T00:00:00.000-1000';
    const sixAMOffset0 = '1995-11-12T06:00:00.000+0000';
    const eightAMOffset0 = '1995-11-12T08:00:00.000+0000';
    const almostMidnightOffset0 = '1995-11-12T23:59:59.999+0000';
    const almostMidnightOffsetNegative1 = '1995-11-12T23:59:59.999-1000';

    it('should display the date in the short format', () => {
      expect(formatDateParsedZoneShort(midnight)).to.equal('11/12/1995');
    });

    it('should display the date string without regard to the timezone or offset', () => {
      expect(formatDateParsedZoneShort(midnight)).to.equal('11/12/1995');
      expect(formatDateParsedZoneShort(midnightOffsetNegative1)).to.equal(
        '11/12/1995',
      );
      expect(formatDateParsedZoneShort(sixAMOffset0)).to.equal('11/12/1995');
      expect(formatDateParsedZoneShort(eightAMOffset0)).to.equal('11/12/1995');
      expect(formatDateParsedZoneShort(almostMidnightOffset0)).to.equal(
        '11/12/1995',
      );
      expect(formatDateParsedZoneShort(almostMidnightOffsetNegative1)).to.equal(
        '11/12/1995',
      );
    });
  });

  describe('formatDateLong', () => {
    const noon = '1995-11-12T12:00:00.000+0000';

    it('should display the date in the short format', () => {
      expect(formatDateLong(noon)).to.equal('November 12, 1995');
    });

    const nhdvs = '1865-03-03T12:00:00.000+0000';

    it('should display the date in the short format without padding', () => {
      expect(formatDateLong(nhdvs)).to.equal('March 3, 1865');
    });

    it('should handle various edge cases', () => {
      const midnight = '1995-11-12T00:00:00.000+0000';
      const midnightOffsetNegative1 = '1995-11-12T00:00:00.000-1000';
      const sixAMOffset0 = '1995-11-12T06:00:00.000+0000';
      const eightAMOffset0 = '1995-11-12T08:00:00.000+0000';
      const almostMidnightOffset0 = '1995-11-12T23:59:59.999+0000';
      const almostMidnightOffsetNegative1 = '1995-11-12T23:59:59.999-1000';
      expect(formatDateLong(midnight)).to.equal('November 12, 1995');
      expect(formatDateLong(midnightOffsetNegative1)).to.equal(
        'November 12, 1995',
      );
      expect(formatDateLong(sixAMOffset0)).to.equal('November 12, 1995');
      expect(formatDateLong(eightAMOffset0)).to.equal('November 12, 1995');
      expect(formatDateLong(almostMidnightOffset0)).to.equal(
        'November 12, 1995',
      );
      expect(formatDateLong(almostMidnightOffsetNegative1)).to.equal(
        'November 13, 1995',
      );
    });
  });

  describe('formatDateParsedZoneLong', () => {
    const midnight = '1995-11-12T00:00:00.000+0000';
    const midnightOffsetNegative1 = '1995-11-12T00:00:00.000-1000';
    const sixAMOffset0 = '1995-11-12T06:00:00.000+0000';
    const eightAMOffset0 = '1995-11-12T08:00:00.000+0000';
    const almostMidnightOffset0 = '1995-11-12T23:59:59.999+0000';
    const almostMidnightOffsetNegative1 = '1995-11-12T23:59:59.999-1000';
    const nhdvsEightAMOffset0 = '1865-03-03T08:00:00.000+0000';

    it('should display the date in the short format', () => {
      expect(formatDateParsedZoneLong(midnight)).to.equal('November 12, 1995');
    });

    it('should display the date string without regard to the timezone or offset', () => {
      expect(formatDateParsedZoneLong(midnight)).to.equal('November 12, 1995');
      expect(formatDateParsedZoneLong(midnightOffsetNegative1)).to.equal(
        'November 12, 1995',
      );
      expect(formatDateParsedZoneLong(sixAMOffset0)).to.equal(
        'November 12, 1995',
      );
      expect(formatDateParsedZoneLong(eightAMOffset0)).to.equal(
        'November 12, 1995',
      );
      expect(formatDateParsedZoneLong(almostMidnightOffset0)).to.equal(
        'November 12, 1995',
      );
      expect(formatDateParsedZoneLong(almostMidnightOffsetNegative1)).to.equal(
        'November 12, 1995',
      );
      expect(formatDateParsedZoneLong(nhdvsEightAMOffset0)).to.equal(
        'March 3, 1865',
      );
    });
  });

  describe('isValidDateString', () => {
    it('returns `false` when passed an invalid argument', () => {
      expect(isValidDateString()).to.be.false;
      expect(isValidDateString(false)).to.be.false;
      expect(isValidDateString({})).to.be.false;
    });
    it('returns `false` when passed a string that cannot be parsed as a date', () => {
      expect(isValidDateString('not a date')).to.be.false;
    });
    it('returns `true` when passed a string that can be parsed as a date', () => {
      expect(isValidDateString('1986-05-06')).to.be.true;
      expect(isValidDateString('2018-01-24T00:00:00.000-06:00')).to.be.true;
    });
  });

  describe('formatDowntime', () => {
    it('returns a formatted datetime', () => {
      expect(formatDowntime('2020-02-17T20:04:51-05:00')).to.equal(
        'Feb. 17 at 8:04 p.m. ET',
      );
    });

    it('returns a formatted datetime with full month name', () => {
      expect(formatDowntime('2020-07-03T03:14:00-04:00')).to.equal(
        'July 3 at 3:14 a.m. ET',
      );
    });

    it('returns a formatted datetime at noon', () => {
      expect(formatDowntime('2020-05-24T12:00:30-04:00')).to.equal(
        'May 24 at noon ET',
      );
    });

    it('returns a formatted datetime past noon', () => {
      expect(formatDowntime('2020-08-19T12:15:30-04:00')).to.equal(
        'Aug. 19 at 12:15 p.m. ET',
      );
    });

    it('returns a formatted datetime at midnight', () => {
      expect(formatDowntime('2020-01-02T00:00:30-05:00')).to.equal(
        'Jan. 2 at midnight ET',
      );
    });

    it('returns a formatted datetime past midnight', () => {
      expect(formatDowntime('2020-11-21T00:35:30-05:00')).to.equal(
        'Nov. 21 at 12:35 a.m. ET',
      );
    });

    it('can handle a moment date', () => {
      expect(formatDowntime(moment('2020-05-24T12:00:30-04:00'))).to.equal(
        'May 24 at noon ET',
      );
    });

    it('can handle a date object', () => {
      expect(formatDowntime(new Date('2020-05-24T12:00:30-04:00'))).to.equal(
        'May 24 at noon ET',
      );
    });
  });

  describe('parseStringOrDate', () => {
    it('should return a Date object when given a valid ISO 8601 date string', () => {
      const dateString = '2023-10-05T14:48:00.000Z';
      const result = parseStringOrDate(dateString);
      expect(result).to.be.an.instanceof(Date);
      expect(result.toISOString()).to.equal(dateString);
    });

    it('should return a Date object when given a valid unix timestamp with ms', () => {
      const dateObject = new Date(2022, 0, 19, 19, 9, 46, 0); // January is month 0 (zero-based)
      const dateString = '1642619386000';
      const result = parseStringOrDate(dateString);
      expect(result).to.be.an.instanceof(Date);
      expect(result.toISOString()).to.equal(dateObject.toISOString());
    });

    it('should return a Date object when given a valid unix timestamp with ms as a number', () => {
      const dateObject = new Date(2022, 0, 19, 19, 9, 46, 0); // January is month 0 (zero-based)
      const dateString = 1642619386000;
      const result = parseStringOrDate(dateString);
      expect(result).to.be.an.instanceof(Date);
      expect(result.toISOString()).to.equal(dateObject.toISOString());
    });

    it('should return the same Date object when given a Date object', () => {
      const dateObject = new Date(2023, 9, 5, 14, 48, 0, 0); // October is month 9 (zero-based)
      const result = parseStringOrDate(dateObject);
      expect(result).to.be.an.instanceof(Date);
      expect(result).to.equal(dateObject);
    });

    it('should throw an error when given an invalid date string', () => {
      const invalidDateString = 'invalid-date';
      expect(() => parseStringOrDate(invalidDateString)).to.throw(
        `Could not parse date string: ${invalidDateString}. Please ensure that you provide a Date object, Unix timestamp with milliseconds, or ISO 8601 date string.`,
      );
    });

    it('should throw an error when given a date in an invalid format', () => {
      const nonDateString = 'Sun Jun 11 2012 00:00:00 GMT-0700 (PDT)';
      expect(() => parseStringOrDate(nonDateString)).to.throw(
        `Could not parse date string: ${nonDateString}. Please ensure that you provide a Date object, Unix timestamp with milliseconds, or ISO 8601 date string.`,
      );
    });

    it('should throw an error when given a non-date string', () => {
      const nonDateString = 'not-a-date';
      expect(() => parseStringOrDate(nonDateString)).to.throw(
        `Could not parse date string: ${nonDateString}. Please ensure that you provide a Date object, Unix timestamp with milliseconds, or ISO 8601 date string.`,
      );
    });

    it('should throw an error when given null', () => {
      const nonDateString = null;
      expect(() => parseStringOrDate(nonDateString)).to.throw(
        `Could not parse date string: ${nonDateString}. Please ensure that you provide a Date object, Unix timestamp with milliseconds, or ISO 8601 date string.`,
      );
    });

    it('should throw an error when given a non-date string', () => {
      const nonDateString = undefined;
      expect(() => parseStringOrDate(nonDateString)).to.throw(
        `Could not parse date string: ${nonDateString}. Please ensure that you provide a Date object, Unix timestamp with milliseconds, or ISO 8601 date string.`,
      );
    });
  });

  describe('stripTimezoneFromIsoDate', () => {
    it('should remove the "Z" timezone designator', () => {
      const date = '2023-10-05T14:48:00.000Z';
      const result = stripTimezoneFromIsoDate(date);
      expect(result).to.equal('2023-10-05T14:48:00.000');
    });

    it('should remove the timezone offset in the format "+HHMM"', () => {
      const date = '2023-10-05T14:48:00.000+0200';
      const result = stripTimezoneFromIsoDate(date);
      expect(result).to.equal('2023-10-05T14:48:00.000');
    });

    it('should remove the timezone offset in the format "-HHMM"', () => {
      const date = '2023-10-05T14:48:00.000-0500';
      const result = stripTimezoneFromIsoDate(date);
      expect(result).to.equal('2023-10-05T14:48:00.000');
    });

    it('should remove the timezone offset in the format "+HH:MM"', () => {
      const date = '2023-10-05T14:48:00.000+02:00';
      const result = stripTimezoneFromIsoDate(date);
      expect(result).to.equal('2023-10-05T14:48:00.000');
    });

    it('should remove the timezone offset in the format "-HH:MM"', () => {
      const date = '2023-10-05T14:48:00.000-05:00';
      const result = stripTimezoneFromIsoDate(date);
      expect(result).to.equal('2023-10-05T14:48:00.000');
    });

    it('should not alter a date string without a timezone', () => {
      const date = '2023-10-05T14:48:00.000';
      const result = stripTimezoneFromIsoDate(date);
      expect(result).to.equal('2023-10-05T14:48:00.000');
    });

    it('should handle an empty string', () => {
      const date = '';
      const result = stripTimezoneFromIsoDate(date);
      expect(result).to.equal('');
    });

    it('should handle a null value', () => {
      const date = null;
      const result = stripTimezoneFromIsoDate(date);
      expect(result).to.equal(null);
    });

    it('should handle an undefined value', () => {
      const date = undefined;
      const result = stripTimezoneFromIsoDate(date);
      expect(result).to.equal(undefined);
    });

    it('should handle a date string with milliseconds', () => {
      const date = '2023-10-05T14:48:00.123Z';
      const result = stripTimezoneFromIsoDate(date);
      expect(result).to.equal('2023-10-05T14:48:00.123');
    });

    it('should handle a date string without milliseconds', () => {
      const date = '2023-10-05T14:48:00Z';
      const result = stripTimezoneFromIsoDate(date);
      expect(result).to.equal('2023-10-05T14:48:00');
    });
  });
});
