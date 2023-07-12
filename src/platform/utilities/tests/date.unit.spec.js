import { expect } from 'chai';
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
    it('should convert date to moment', () => {
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

      expect(date.isValid()).to.be.true;
      expect(date.year()).to.equal(1901);
      expect(date.month()).to.equal(1);
      expect(date.date()).to.equal(3);
    });
    it('should convert partial date to moment', () => {
      const date = dateToMoment({
        month: {
          value: 2,
        },
        year: {
          value: '1901',
        },
      });

      expect(date.isValid()).to.be.true;
      expect(date.year()).to.equal(1901);
      expect(date.month()).to.equal(1);
      expect(date.date()).to.equal(1);
    });
  });

  describe('timeFromNow', () => {
    const today = moment();
    it('should display time in days', () => {
      expect(timeFromNow(moment(today).add(30, 'days'), today)).to.equal(
        '30 days',
      );
    });
    it('should display time in hours', () => {
      expect(timeFromNow(moment(today).add(23, 'hours'), today)).to.equal(
        '23 hours',
      );
    });
    it('should display time in minutes', () => {
      expect(timeFromNow(moment(today).add(59, 'minutes'), today)).to.equal(
        '59 minutes',
      );
    });
    it('should display time in seconds', () => {
      expect(timeFromNow(moment(today).add(59, 'seconds'), today)).to.equal(
        '59 seconds',
      );
    });
  });

  describe('formatDateShort', () => {
    const noon = '1995-11-12T12:00:00.000+0000';

    it('should display the date in the short format', () => {
      expect(formatDateShort(noon)).to.equal('11/12/1995');
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
  });
});
