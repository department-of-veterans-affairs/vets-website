import { expect } from 'chai';
import {
  getAvailableDateTimeForBlockedIssue,
  isTodayOrInFuture,
} from '../../validations/date';

describe('isTodayOrInFuture - Dual Validation Logic', () => {
  describe('Invalid date handling', () => {
    it('should return false for null date', () => {
      const result = isTodayOrInFuture(null);
      expect(result).to.be.false;
    });

    it('should return false for undefined date', () => {
      const result = isTodayOrInFuture(undefined);
      expect(result).to.be.false;
    });

    it('should return false for invalid Date object', () => {
      const result = isTodayOrInFuture(new Date('invalid'));
      expect(result).to.be.false;
    });

    it('should return false for malformed date string', () => {
      const result = isTodayOrInFuture(new Date('not-a-date'));
      expect(result).to.be.false;
    });
  });

  describe('Local timezone blocking (Step 1 of dual validation)', () => {
    it('should block when decision date equals today in local timezone', () => {
      const now = new Date();
      const today = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        15,
        0,
        0,
      );

      const result = isTodayOrInFuture(today);
      expect(result).to.be.true;
    });

    it('should block future dates in local timezone', () => {
      const now = new Date();
      const tomorrow = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        12,
        0,
        0,
      );
      const result = isTodayOrInFuture(tomorrow);
      expect(result).to.be.true;
    });
  });

  describe('UTC validation (Step 2 of dual validation)', () => {
    it('should handle UTC edge case - decision date just before UTC midnight', () => {
      const now = new Date();
      const beforeUTCMidnight = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate() - 1,
          23,
          59,
          59,
          999,
        ),
      );
      const result = isTodayOrInFuture(beforeUTCMidnight);
      expect(result).to.be.false;
    });

    it('should handle same calendar date consistently in different timezones', () => {
      const dateUTC = new Date('2023-06-15T00:00:00.000Z'); // UTC midnight
      const dateEST = new Date('2023-06-15T05:00:00.000Z'); // Same day, 1am EST
      const datePST = new Date('2023-06-15T08:00:00.000Z'); // Same day, 1am PST

      const resultUTC = isTodayOrInFuture(dateUTC);
      const resultEST = isTodayOrInFuture(dateEST);
      const resultPST = isTodayOrInFuture(datePST);

      expect(resultUTC).to.be.false;
      expect(resultEST).to.be.false;
      expect(resultPST).to.be.false;
    });
  });

  describe('Dual validation integration', () => {
    it('should allow when decision date is in past for both local and UTC', () => {
      const now = new Date();
      const yesterday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 1,
        12,
        0,
        0,
      );
      const result = isTodayOrInFuture(yesterday);
      expect(result).to.be.false;
    });

    it('should block today dates regardless of time (CA timezone edge case)', () => {
      // Test CA scenario: Someone in California at 5 PM PST (which is midnight UTC next day)
      // Even though it's technically the next day in UTC, we still block because it's "today" locally
      // This tests that our local timezone check (Step 1) takes priority over UTC conversion
      const now = new Date();

      const todayMorning = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        9, // 9 AM PST local time
        0,
        0,
      );

      const todayEvening = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        17, // 5 PM PST local time (midnight UTC next day)
        0,
        0,
      );

      const morningResult = isTodayOrInFuture(todayMorning);
      const eveningResult = isTodayOrInFuture(todayEvening);

      expect(morningResult).to.be.true;
      expect(eveningResult).to.be.true;
    });
  });
});

describe('getAvailableDateTimeForBlockedIssue', () => {
  // Helper to format month according to VA.gov style guide
  const formatMonth = date => {
    const month = date.getMonth();
    const monthNames = [
      'Jan.',
      'Feb.',
      'March',
      'April',
      'May',
      'June',
      'July',
      'Aug.',
      'Sept.',
      'Oct.',
      'Nov.',
      'Dec.',
    ];

    return monthNames[month];
  };

  describe('user timezone behind UTC', () => {
    it('should show midnight next day in local time when decision date is today', () => {
      const now = new Date();
      const decisionDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        13,
        0,
        0,
      );

      const result = getAvailableDateTimeForBlockedIssue(decisionDate);

      const tomorrow = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
      );

      const monthFormatted = formatMonth(tomorrow);
      const day = tomorrow.getDate();
      const year = tomorrow.getFullYear();

      expect(result).to.include(`${monthFormatted} ${day}, ${year}`);
      expect(result).to.match(/12:00 a\.m\./);
    });

    it('should show midnight next day when decision date is in future', () => {
      const now = new Date();
      const decisionDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        10,
        0,
        0,
      );

      const result = getAvailableDateTimeForBlockedIssue(decisionDate);

      const dayAfterTomorrow = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 2,
      );
      const monthFormatted = formatMonth(dayAfterTomorrow);
      const day = dayAfterTomorrow.getDate();
      const year = dayAfterTomorrow.getFullYear();

      expect(result).to.include(`${monthFormatted} ${day}, ${year}`);
      expect(result).to.match(/12:00 a\.m\./);
    });
  });

  describe('User AHEAD of UTC', () => {
    it('should convert UTC midnight to local time when decision is today', () => {
      const now = new Date();
      const decisionDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        9,
        0,
        0,
      );

      const result = getAvailableDateTimeForBlockedIssue(decisionDate);

      const tomorrow = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
      );

      const monthFormatted = formatMonth(tomorrow);
      const day = tomorrow.getDate();
      const year = tomorrow.getFullYear();

      expect(result).to.include(`${monthFormatted} ${day}, ${year}`);
    });

    it('should convert UTC midnight to local time for future decision dates', () => {
      const now = new Date();
      const decisionDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        11,
        0,
        0,
      );

      const result = getAvailableDateTimeForBlockedIssue(decisionDate);

      const dayAfterTomorrow = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 2,
      );
      const monthFormatted = formatMonth(dayAfterTomorrow);
      const day = dayAfterTomorrow.getDate();
      const year = dayAfterTomorrow.getFullYear();

      expect(result).to.include(`${monthFormatted} ${day}, ${year}`);
    });
  });
});
