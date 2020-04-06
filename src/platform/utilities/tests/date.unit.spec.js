import moment from 'moment';

import {
  dateToMoment,
  timeFromNow,
  formatDateShort,
  formatDateParsedZoneShort,
  formatDateLong,
  formatDateParsedZoneLong,
  isValidDateString,
  formatDowntime,
} from '../date';

describe('Helpers unit tests', () => {
  describe('dateToMoment', () => {
    test('should convert date to moment', () => {
      const date = dateToMoment({
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

      expect(date.isValid()).toBe(true);
      expect(date.year()).toBe(1901);
      expect(date.month()).toBe(1);
      expect(date.date()).toBe(3);
    });
    test('should convert partial date to moment', () => {
      const date = dateToMoment({
        month: {
          value: 2,
        },
        year: {
          value: '1901',
        },
      });

      expect(date.isValid()).toBe(true);
      expect(date.year()).toBe(1901);
      expect(date.month()).toBe(1);
      expect(date.date()).toBe(1);
    });
  });

  describe('timeFromNow', () => {
    const today = moment();
    test('should display time in days', () => {
      expect(timeFromNow(moment(today).add(30, 'days'), today)).toBe('30 days');
    });
    test('should display time in hours', () => {
      expect(timeFromNow(moment(today).add(23, 'hours'), today)).toBe(
        '23 hours',
      );
    });
    test('should display time in minutes', () => {
      expect(timeFromNow(moment(today).add(59, 'minutes'), today)).toBe(
        '59 minutes',
      );
    });
    test('should display time in seconds', () => {
      expect(timeFromNow(moment(today).add(59, 'seconds'), today)).toBe(
        '59 seconds',
      );
    });
  });

  describe('formatDateShort', () => {
    const noon = '1995-11-12T12:00:00.000+0000';

    test('should display the date in the short format', () => {
      expect(formatDateShort(noon)).toBe('11/12/1995');
    });
  });

  describe('formatDateParsedZoneShort', () => {
    const midnight = '1995-11-12T00:00:00.000+0000';
    const midnightOffsetNegative1 = '1995-11-12T00:00:00.000-1000';
    const sixAMOffset0 = '1995-11-12T06:00:00.000+0000';
    const eightAMOffset0 = '1995-11-12T08:00:00.000+0000';
    const almostMidnightOffset0 = '1995-11-12T23:59:59.999+0000';
    const almostMidnightOffsetNegative1 = '1995-11-12T23:59:59.999-1000';

    test('should display the date in the short format', () => {
      expect(formatDateParsedZoneShort(midnight)).toBe('11/12/1995');
    });

    test(
      'should display the date string without regard to the timezone or offset',
      () => {
        expect(formatDateParsedZoneShort(midnight)).toBe('11/12/1995');
        expect(formatDateParsedZoneShort(midnightOffsetNegative1)).toBe(
          '11/12/1995',
        );
        expect(formatDateParsedZoneShort(sixAMOffset0)).toBe('11/12/1995');
        expect(formatDateParsedZoneShort(eightAMOffset0)).toBe('11/12/1995');
        expect(formatDateParsedZoneShort(almostMidnightOffset0)).toBe(
          '11/12/1995',
        );
        expect(formatDateParsedZoneShort(almostMidnightOffsetNegative1)).toBe(
          '11/12/1995',
        );
      }
    );
  });

  describe('formatDateLong', () => {
    const noon = '1995-11-12T12:00:00.000+0000';

    test('should display the date in the short format', () => {
      expect(formatDateLong(noon)).toBe('November 12, 1995');
    });
  });

  describe('formatDateParsedZoneLong', () => {
    const midnight = '1995-11-12T00:00:00.000+0000';
    const midnightOffsetNegative1 = '1995-11-12T00:00:00.000-1000';
    const sixAMOffset0 = '1995-11-12T06:00:00.000+0000';
    const eightAMOffset0 = '1995-11-12T08:00:00.000+0000';
    const almostMidnightOffset0 = '1995-11-12T23:59:59.999+0000';
    const almostMidnightOffsetNegative1 = '1995-11-12T23:59:59.999-1000';

    test('should display the date in the short format', () => {
      expect(formatDateParsedZoneLong(midnight)).toBe('November 12, 1995');
    });

    test(
      'should display the date string without regard to the timezone or offset',
      () => {
        expect(formatDateParsedZoneLong(midnight)).toBe('November 12, 1995');
        expect(formatDateParsedZoneLong(midnightOffsetNegative1)).toBe(
          'November 12, 1995',
        );
        expect(formatDateParsedZoneLong(sixAMOffset0)).toBe('November 12, 1995');
        expect(formatDateParsedZoneLong(eightAMOffset0)).toBe(
          'November 12, 1995',
        );
        expect(formatDateParsedZoneLong(almostMidnightOffset0)).toBe(
          'November 12, 1995',
        );
        expect(formatDateParsedZoneLong(almostMidnightOffsetNegative1)).toBe(
          'November 12, 1995',
        );
      }
    );
  });

  describe('isValidDateString', () => {
    test('returns `false` when passed an invalid argument', () => {
      expect(isValidDateString()).toBe(false);
      expect(isValidDateString(false)).toBe(false);
      expect(isValidDateString({})).toBe(false);
    });
    test(
      'returns `false` when passed a string that cannot be parsed as a date',
      () => {
        expect(isValidDateString('not a date')).toBe(false);
      }
    );
    test(
      'returns `true` when passed a string that can be parsed as a date',
      () => {
        expect(isValidDateString('1986-05-06')).toBe(true);
        expect(isValidDateString('2018-01-24T00:00:00.000-06:00')).toBe(true);
      }
    );
  });

  describe('formatDowntime', () => {
    test('returns a formatted datetime', () => {
      expect(formatDowntime('2020-02-17T20:04:51-05:00')).toBe(
        'Feb. 17 at 8:04 p.m. ET',
      );
    });

    test('returns a formatted datetime with full month name', () => {
      expect(formatDowntime('2020-07-03T03:14:00-04:00')).toBe(
        'July 3 at 3:14 a.m. ET',
      );
    });

    test('returns a formatted datetime at noon', () => {
      expect(formatDowntime('2020-05-24T12:00:30-04:00')).toBe(
        'May 24 at noon ET',
      );
    });

    test('returns a formatted datetime past noon', () => {
      expect(formatDowntime('2020-08-19T12:15:30-04:00')).toBe(
        'Aug. 19 at 12:15 p.m. ET',
      );
    });

    test('returns a formatted datetime at midnight', () => {
      expect(formatDowntime('2020-01-02T00:00:30-05:00')).toBe(
        'Jan. 2 at midnight ET',
      );
    });

    test('returns a formatted datetime past midnight', () => {
      expect(formatDowntime('2020-11-21T00:35:30-05:00')).toBe(
        'Nov. 21 at 12:35 a.m. ET',
      );
    });
  });
});
