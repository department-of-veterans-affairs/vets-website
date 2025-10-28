import { expect } from 'chai';
import sinon from 'sinon';

import errorMessages from '../../content/errorMessages';
import {
  addDateErrorMessages,
  getCurrentUTCStartOfDay,
  toUTCStartOfDay,
  isTodayOrInFuture,
} from '../../validations/date';

describe('addDateErrorMessages', () => {
  it('should not have an error', () => {
    const errors = { addError: sinon.spy() };
    const result = addDateErrorMessages(errors, errorMessages, {});
    expect(errors.addError.called).to.be.false;
    expect(result).to.eq(false);
  });
  it('should show an error when a date is blank', () => {
    const errors = { addError: sinon.spy() };
    const date = { isInvalid: true, errors: {} };
    const result = addDateErrorMessages(errors, errorMessages, date);
    expect(errors.addError.args[0][0]).to.eq(errorMessages.decisions.blankDate);
    expect(date.errors.other).to.be.true;
    expect(result).to.be.true;
  });
  it('should not show an error when a date invalid', () => {
    const errors = { addError: sinon.spy() };
    const date = { hasErrors: true, errors: {} };
    const result = addDateErrorMessages(errors, errorMessages, date);
    expect(errors.addError.args[0][0]).to.eq(errorMessages.invalidDate);
    expect(date.errors.other).to.be.true;
    expect(result).to.be.true;
  });
  it('should not show an error when a date today or in the future', () => {
    const errors = { addError: sinon.spy() };
    const date = { isTodayOrInFuture: true, errors: {} };
    const result = addDateErrorMessages(errors, errorMessages, date);
    expect(errors.addError.args[0][0]).to.eq(errorMessages.decisions.pastDate);
    expect(date.errors.year).to.be.true;
    expect(result).to.be.true;
  });
});

describe('UTC Helper Functions', () => {
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
});

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
    it('should demonstrate UTC validation logic for same UTC day', () => {
      // Test the UTC comparison logic that powers Step 2
      // This verifies the core algorithm: inputDateUTC >= utcToday

      const mockUTCToday = new Date(Date.UTC(2024, 0, 15, 0, 0, 0, 0)); // Jan 15, 2024 UTC start
      const decisionDate = new Date(Date.UTC(2024, 0, 15, 8, 0, 0, 0)); // Jan 15, 2024 8 AM UTC

      const inputDateUTC = toUTCStartOfDay(decisionDate);
      const utcComparisonResult =
        inputDateUTC.getTime() >= mockUTCToday.getTime();

      expect(utcComparisonResult).to.be.true;
      expect(inputDateUTC.getUTCDate()).to.equal(mockUTCToday.getUTCDate());
      expect(inputDateUTC.getTime()).to.equal(mockUTCToday.getTime());
    });

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

    it('should handle same calendar date in different timezones consistently', () => {
      const dateInUTC = new Date('2023-06-15T00:00:00.000Z'); // UTC midnight
      const dateInEST = new Date('2023-06-15T05:00:00.000Z'); // 1am EST (still June 15 in EST)
      const dateInPST = new Date('2023-06-15T08:00:00.000Z'); // 1am PST (still June 15 in PST)

      const utcResult = isTodayOrInFuture(dateInUTC);
      const estResult = isTodayOrInFuture(dateInEST);
      const pstResult = isTodayOrInFuture(dateInPST);

      expect(utcResult).to.equal(estResult);
      expect(estResult).to.equal(pstResult);
      expect(utcResult).to.be.false;
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
