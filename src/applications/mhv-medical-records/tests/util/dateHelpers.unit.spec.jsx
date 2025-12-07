import { expect } from 'chai';
import {
  formatDateYear,
  formatDateMonthDayCommaYear,
  formatDateMonthDayCommaYearHoursMinutes,
  currentDateMinusMinutes,
  currentDateAddHours,
  currentDateAddOneHourMinusOneMinute,
  currentDateAddSecondsForFileDownload,
} from '../../util/dateHelpers';

describe('dateHelpers', () => {
  describe('formatDateYear', () => {
    it('should format a date to just the year', () => {
      const result = formatDateYear('2024-11-27T15:30:00.000Z');
      expect(result).to.equal('2024');
    });

    it('should return the year from a date string with timezone', () => {
      const result = formatDateYear('2023-01-15T12:00:00.000Z');
      expect(result).to.equal('2023');
    });

    it('should handle different date formats', () => {
      const result = formatDateYear(new Date('2025-05-20T00:00:00.000Z'));
      expect(result).to.equal('2025');
    });
  });

  describe('formatDateMonthDayCommaYear', () => {
    it('should format a date as "Month day, year"', () => {
      const result = formatDateMonthDayCommaYear('2023-11-27T15:30:00.000Z');
      expect(result).to.equal('November 27, 2023');
    });

    it('should format a date string with UTC timezone', () => {
      const result = formatDateMonthDayCommaYear('2024-01-15T12:00:00.000Z');
      expect(result).to.equal('January 15, 2024');
    });

    it('should handle single-digit days correctly', () => {
      const result = formatDateMonthDayCommaYear('2023-03-05T12:00:00.000Z');
      expect(result).to.equal('March 5, 2023');
    });

    it('should handle December dates', () => {
      const result = formatDateMonthDayCommaYear('2023-12-25T12:00:00.000Z');
      expect(result).to.equal('December 25, 2023');
    });
  });

  describe('formatDateMonthDayCommaYearHoursMinutes', () => {
    it('should format a date with month, day, year, hours, and minutes', () => {
      // Input is in UTC, function subtracts 4 hours and formats in UTC
      const result = formatDateMonthDayCommaYearHoursMinutes(
        '2022-08-18T20:29:00.000Z',
      );
      // 20:29 UTC - 4 hours = 16:29 (4:29 PM)
      expect(result).to.equal('August 18, 2022, 4:29');
    });

    it('should handle midnight correctly', () => {
      const result = formatDateMonthDayCommaYearHoursMinutes(
        '2023-01-01T04:00:00.000Z',
      );
      // 04:00 UTC - 4 hours = 00:00 (12:00 AM)
      expect(result).to.equal('January 1, 2023, 12:00');
    });

    it('should handle noon correctly', () => {
      const result = formatDateMonthDayCommaYearHoursMinutes(
        '2023-06-15T16:00:00.000Z',
      );
      // 16:00 UTC - 4 hours = 12:00 (12:00 PM)
      expect(result).to.equal('June 15, 2023, 12:00');
    });
  });

  describe('currentDateMinusMinutes', () => {
    it('should return a valid UTC ISO formatted string', () => {
      const result = currentDateMinusMinutes(15);
      // Validate the format: YYYY-MM-DDTHH:mm:ss.sssZ
      expect(result).to.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it('should return a date in the past', () => {
      const result = currentDateMinusMinutes(60);
      const resultDate = new Date(result);
      const now = new Date();
      // Result should be approximately 60 minutes in the past (allow 1 second tolerance)
      const diffMs = now.getTime() - resultDate.getTime();
      const diffMinutes = diffMs / (1000 * 60);
      expect(diffMinutes).to.be.closeTo(60, 0.1);
    });

    it('should handle 0 minutes', () => {
      const result = currentDateMinusMinutes(0);
      const resultDate = new Date(result);
      const now = new Date();
      const diffMs = Math.abs(now.getTime() - resultDate.getTime());
      // Should be within 1 second of current time
      expect(diffMs).to.be.lessThan(1000);
    });
  });

  describe('currentDateAddHours', () => {
    it('should return a valid UTC ISO formatted string', () => {
      const result = currentDateAddHours(5);
      // Validate the format: YYYY-MM-DDTHH:mm:ss.sssZ
      expect(result).to.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it('should return a date in the future', () => {
      const result = currentDateAddHours(2);
      const resultDate = new Date(result);
      const now = new Date();
      // Result should be approximately 2 hours in the future
      const diffMs = resultDate.getTime() - now.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      expect(diffHours).to.be.closeTo(2, 0.01);
    });

    it('should handle 0 hours', () => {
      const result = currentDateAddHours(0);
      const resultDate = new Date(result);
      const now = new Date();
      const diffMs = Math.abs(now.getTime() - resultDate.getTime());
      // Should be within 1 second of current time
      expect(diffMs).to.be.lessThan(1000);
    });
  });

  describe('currentDateAddOneHourMinusOneMinute', () => {
    it('should return a valid UTC ISO formatted string', () => {
      const result = currentDateAddOneHourMinusOneMinute();
      // Validate the format: YYYY-MM-DDTHH:mm:ss.sssZ
      expect(result).to.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it('should return a date approximately 59 minutes in the future', () => {
      const result = currentDateAddOneHourMinusOneMinute();
      const resultDate = new Date(result);
      const now = new Date();
      // Result should be approximately 59 minutes in the future (1 hour - 1 minute)
      const diffMs = resultDate.getTime() - now.getTime();
      const diffMinutes = diffMs / (1000 * 60);
      expect(diffMinutes).to.be.closeTo(59, 0.1);
    });
  });

  describe('currentDateAddSecondsForFileDownload', () => {
    it('should return a formatted date string in the expected format', () => {
      const result = currentDateAddSecondsForFileDownload(0);
      // Validate the format: MM-DD-YYYY_HHmmssAM or MM-DD-YYYY_HHmmssPM
      expect(result).to.match(/^\d{2}-\d{2}-\d{4}_\d{6}(AM|PM)$/);
    });

    it('should include the correct format elements', () => {
      const result = currentDateAddSecondsForFileDownload(0);
      // Check it contains dashes and underscore in expected positions
      expect(result.charAt(2)).to.equal('-');
      expect(result.charAt(5)).to.equal('-');
      expect(result.charAt(10)).to.equal('_');
    });

    it('should end with AM or PM', () => {
      const result = currentDateAddSecondsForFileDownload(0);
      expect(result.endsWith('AM') || result.endsWith('PM')).to.be.true;
    });
  });
});
