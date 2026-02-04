import { expect } from 'chai';
import {
  formatDateYear,
  formatDateMonthDayCommaYear,
  formatDateMonthDayCommaYearHoursMinutes,
  formatDateTimeInUserTimezone,
  currentDateMinusMinutes,
  currentDateAddHours,
  currentDateAddSecondsForFileDownload,
  formatDateForDownload,
} from '../../util/dateHelpers';

describe('dateHelpers', () => {
  describe('formatDateTimeInUserTimezone', () => {
    it('should format UTC ISO string in given timezone with timezone abbreviation', () => {
      // 2024-11-14T18:19:23Z in America/New_York (EST) = 1:19 p.m. EST
      const result = formatDateTimeInUserTimezone(
        '2024-11-14T18:19:23Z',
        'MMMM d, yyyy, h:mm a',
        'America/New_York',
      );
      expect(result).to.equal('November 14, 2024, 1:19 p.m. EST');
    });

    it('should format ISO string with timezone offset in given timezone', () => {
      // 2024-11-14T13:19:23-05:00 is the same instant as 2024-11-14T18:19:23Z
      // Displayed in America/New_York (EST) = 1:19 p.m. EST
      const result = formatDateTimeInUserTimezone(
        '2024-11-14T13:19:23-05:00',
        'MMMM d, yyyy, h:mm a',
        'America/New_York',
      );
      expect(result).to.equal('November 14, 2024, 1:19 p.m. EST');
    });

    it('should return null for bad input', () => {
      expect(formatDateTimeInUserTimezone(null, undefined, 'America/New_York'))
        .to.be.null;
      expect(formatDateTimeInUserTimezone('', undefined, 'America/New_York')).to
        .be.null;
    });

    it('should handle date-only string (YYYY-MM-DD)', () => {
      const result = formatDateTimeInUserTimezone(
        '2024-11-14',
        'MMMM d, yyyy, h:mm a',
        'America/New_York',
      );
      expect(result).to.equal('November 14, 2024');
    });

    it('should handle year-only string (YYYY)', () => {
      const result = formatDateTimeInUserTimezone(
        '2024',
        'MMMM d, yyyy, h:mm a',
        'America/New_York',
      );
      expect(result).to.equal('2024');
    });

    it('should handle year-month string (YYYY-MM)', () => {
      const result = formatDateTimeInUserTimezone(
        '2024-11',
        'MMMM d, yyyy, h:mm a',
        'America/New_York',
      );
      expect(result).to.equal('November 2024');
    });

    it('should handle datetime with milliseconds', () => {
      // 2024-11-14T18:19:23.456Z in America/New_York (EST) = 1:19 p.m. EST
      const result = formatDateTimeInUserTimezone(
        '2024-11-14T18:19:23.456Z',
        'MMMM d, yyyy, h:mm a',
        'America/New_York',
      );
      expect(result).to.equal('November 14, 2024, 1:19 p.m. EST');
    });
  });

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

  describe('formatDateForDownload', () => {
    it('should return a formatted date string in the expected format', () => {
      const result = formatDateForDownload(0);
      // Validate the format: M-d-yyyy_hhmmssa (e.g., 12-17-2025_021530PM or 1-5-2025_091530AM)
      expect(result).to.match(/^\d{1,2}-\d{1,2}-\d{4}_\d{6}(AM|PM)$/);
    });

    it('should include the correct format elements', () => {
      const result = formatDateForDownload(0);
      // Check it contains dashes and underscore
      expect(result).to.include('-');
      expect(result).to.include('_');
    });

    it('should end with AM or PM', () => {
      const result = formatDateForDownload(0);
      expect(result.endsWith('AM') || result.endsWith('PM')).to.be.true;
    });

    it('should handle adding seconds to the current time', () => {
      const result = formatDateForDownload(60);
      // Validate the format still matches expected pattern
      expect(result).to.match(/^\d{1,2}-\d{1,2}-\d{4}_\d{6}(AM|PM)$/);
    });

    it('should handle 0 seconds', () => {
      const result = formatDateForDownload(0);
      // Should return a valid formatted string
      expect(result).to.be.a('string');
      expect(result.length).to.be.at.least(15); // Minimum length: M-d-yyyy_hhmmssAM
    });

    it('should contain the year in the format', () => {
      const result = formatDateForDownload(0);
      const currentYear = new Date().getFullYear().toString();
      expect(result).to.include(currentYear);
    });

    it('should have underscore separating date and time', () => {
      const result = formatDateForDownload(0);
      const parts = result.split('_');
      expect(parts).to.have.lengthOf(2);
      // First part should be the date (M-d-yyyy)
      expect(parts[0]).to.match(/^\d{1,2}-\d{1,2}-\d{4}$/);
      // Second part should be the time with AM/PM (hhmmssAM or hhmmssPM)
      expect(parts[1]).to.match(/^\d{6}(AM|PM)$/);
    });
  });
});
