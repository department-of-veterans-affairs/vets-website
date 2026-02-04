import { expect } from 'chai';
import sinon from 'sinon';

import errorMessages from '../../content/errorMessages';
import {
  addDateErrorMessages,
  createDecisionDateErrorMsg,
  isInvalidDateString,
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
    const date = {
      isTodayOrInFuture: true,
      errors: {},
      dateObj: new Date(), // Add the dateObj property that createDecisionDateErrorMsg needs
    };
    const result = addDateErrorMessages(errors, errorMessages, date);
    expect(errors.addError.args[0][0]).to.match(
      /The date must be before [A-Za-z]+\.? \d+, \d{4}\./,
    );
    expect(date.errors.year).to.be.true;
    expect(result).to.be.true;
  });
});

describe('isInvalidDateString', () => {
  describe('invalid year', () => {
    it('should return true', () => {
      expect(isInvalidDateString('', '15', '06', '2023-06-15')).to.be.true;
      expect(isInvalidDateString(NaN, '15', '06', '2023-06-15')).to.be.true;
      expect(isInvalidDateString(null, '15', '06', '2023-06-15')).to.be.true;
      expect(isInvalidDateString(undefined, '15', '06', '2023-06-15')).to.be
        .true;
      expect(isInvalidDateString('a', '15', '06', '2023-06-15')).to.be.true;
    });
  });

  describe('invalid day', () => {
    it('should return true', () => {
      expect(isInvalidDateString('2023', '', '06', '2023-06-15')).to.be.true;
      expect(isInvalidDateString('2023', NaN, '06', '2023-06-15')).to.be.true;
      expect(isInvalidDateString('2023', null, '06', '2023-06-15')).to.be.true;
      expect(isInvalidDateString('2023', undefined, '06', '2023-06-15')).to.be
        .true;
      expect(isInvalidDateString('2023', 'a', '06', '2023-06-15')).to.be.true;
    });
  });

  describe('invalid month', () => {
    it('should return true', () => {
      expect(isInvalidDateString('2023', '15', '', '2023-06-15')).to.be.true;
      expect(isInvalidDateString('2023', '15', NaN, '2023-06-15')).to.be.true;
      expect(isInvalidDateString('2023', '15', null, '2023-06-15')).to.be.true;
      expect(isInvalidDateString('2023', '15', undefined, '2023-06-15')).to.be
        .true;
      expect(isInvalidDateString('2023', '15', 'a', '2023-06-15')).to.be.true;
    });
  });

  describe('invalid date string length', () => {
    it('should return true', () => {
      expect(isInvalidDateString('2023', '15', '06', '')).to.be.true;
      expect(isInvalidDateString('2023', '15', '06', NaN)).to.be.true;
      expect(isInvalidDateString('2023', '15', '06', null)).to.be.true;
      expect(isInvalidDateString('2023', '15', '06', undefined)).to.be.true;
      expect(isInvalidDateString('2023', '15', '06', 'a')).to.be.true;
      expect(isInvalidDateString('2023', '15', '06', '023-06-15')).to.be.true;
      expect(isInvalidDateString('2023', '15', '06', '2023-06-1')).to.be.true;
    });
  });
});

describe('createDecisionDateErrorMsg', () => {
  it("should format error message with readable date using today's date", () => {
    const result = createDecisionDateErrorMsg(errorMessages);

    expect(result).to.match(
      /The date must be before [A-Za-z]+\.? \d+, \d{4}\./,
    );
  });

  it('should work with the actual errorMessages.decisions.pastDate function', () => {
    const result = createDecisionDateErrorMsg(errorMessages);

    expect(typeof errorMessages.decisions.pastDate).to.equal('function');
    expect(result).to.match(
      /The date must be before [A-Za-z]+\.? \d+, \d{4}\./,
    );
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
