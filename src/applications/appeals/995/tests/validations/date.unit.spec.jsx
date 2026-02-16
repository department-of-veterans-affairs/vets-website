import { expect } from 'chai';
import {
  validateDate,
  validateToDate,
  isValidDate,
  validateYMDate,
} from '../../validations/date';
import { errorMessages as scErrors } from '../../constants';
import { parseDate, parseDateWithOffset } from '../../../shared/utils/dates';
import errorMessages from '../../../shared/content/errorMessages';
import { MAX_YEARS_PAST } from '../../../shared/constants';

describe('date validations', () => {
  describe('validateDate', () => {
    let errorMessage = [];
    const errors = {
      addError: message => {
        errorMessage.push(message || '');
      },
    };

    beforeEach(() => {
      errorMessage = [];
    });

    const assertErrors = expectations => {
      const all = ['month', 'day', 'year', 'other'];

      all.forEach(error => {
        if (expectations.includes(error)) {
          expect(errorMessage[1]).to.contain(error);
        } else {
          expect(errorMessage[1]).to.not.contain(error);
        }
      });
    };

    it('should not add an error message for a date from a week ago', () => {
      const date = parseDateWithOffset({ weeks: -1 });
      validateDate(errors, date);
      expect(errorMessage[0]).to.be.undefined;
    });

    it('should not add an error message for a date without a leading zero', () => {
      const date = '2020-1-1';
      validateDate(errors, date);
      expect(errorMessage[0]).to.be.undefined;
    });

    it('should throw a missing date error when an invalid date is given', () => {
      validateDate(errors, '200');
      expect(errorMessage[0]).to.eq(errorMessages.invalidDate);
      assertErrors(['month', 'day', 'other']);
    });

    it('should throw a missing date error when month is a symbol', () => {
      validateDate(errors, '2023-?-05'); // "?" for month
      expect(errorMessage[0]).to.eq(errorMessages.invalidDate);
      assertErrors(['other']);
    });

    it('should throw a missing date error when day is a symbol', () => {
      validateDate(errors, '2023-02-?'); // "?" for day
      expect(errorMessage[0]).to.eq(errorMessages.invalidDate);
      assertErrors(['other']);
    });

    it('should throw an invalid date error when the date does not exist', () => {
      validateDate(errors, '2023-02-29'); // max 28 days
      expect(errorMessage[0]).to.eq(errorMessages.invalidDate);
      assertErrors(['day', 'other']);
    });

    it('should throw a range error for dates too old', () => {
      validateDate(errors, '1899-01-01');
      expect(errorMessage[0]).to.eq(scErrors.evidence.newerDate);
      assertErrors(['year']);
    });

    it('should throw an error for dates in the future', () => {
      const date = parseDateWithOffset({ weeks: 1 });
      validateDate(errors, date);
      expect(errorMessage[0]).to.eq(scErrors.evidence.pastDate);
      assertErrors(['year']);
    });

    it('should throw an error for todays date', () => {
      const date = parseDate(new Date());
      validateDate(errors, date);
      expect(errorMessage[0]).to.eq(scErrors.evidence.pastDate);
      assertErrors(['year']);
    });

    it('should throw an error for dates in the distant past', () => {
      const date = parseDateWithOffset({ years: -(MAX_YEARS_PAST + 1) });
      validateDate(errors, date);
      expect(errorMessage[0]).to.contain(scErrors.evidence.newerDate);
      assertErrors(['year']);
    });

    it('should throw a invalid date for truncated dates', () => {
      // Testing 'YYYY-MM-' (contact center reported errors; FE seeing this)
      const date = parseDateWithOffset({ weeks: 1 }).substring(0, 8);
      validateDate(errors, date);
      expect(errorMessage[0]).to.eq(errorMessages.invalidDate);
      assertErrors(['day', 'other']);
    });

    it('should throw a invalid date for truncated dates', () => {
      // Testing 'YYYY--DD' (contact center reported errors; BE seeing this)
      const date = parseDateWithOffset({ weeks: 1 }).replace(/-.*-/, '--');
      validateDate(errors, date);
      expect(errorMessage[0]).to.eq(errorMessages.invalidDate);
      assertErrors(['month', 'other']);
    });
  });

  describe('validateToDate', () => {
    let errorMessage = [];
    const errors = {
      addError: message => {
        errorMessage.push(message || '');
      },
    };

    beforeEach(() => {
      errorMessage = [];
    });

    it('should not add an error for a valid date range', () => {
      const fromDate = parseDateWithOffset({ months: -2 });
      const toDate = parseDateWithOffset({ weeks: -1 });
      const data = {
        treatmentDates: {
          from: fromDate,
          to: toDate,
        },
      };
      validateToDate(errors, data, 'treatmentDates');
      expect(errorMessage[0]).to.be.undefined;
    });

    it('should add an error when the to date is invalid', () => {
      const data = {
        treatmentDates: {
          from: parseDateWithOffset({ months: -2 }),
          to: 'invalid-date',
        },
      };
      validateToDate(errors, data, 'treatmentDates');
      expect(errorMessage[0]).to.eq(errorMessages.invalidDate);
    });

    it('should add an error when the to date is in the future', () => {
      const data = {
        treatmentDates: {
          from: parseDateWithOffset({ months: -2 }),
          to: parseDateWithOffset({ weeks: 1 }),
        },
      };
      validateToDate(errors, data, 'treatmentDates');
      expect(errorMessage[0]).to.eq(scErrors.evidence.pastDate);
    });

    it('should add an error when the to date is before the from date', () => {
      const fromDate = parseDateWithOffset({ months: -1 });
      const toDate = parseDateWithOffset({ months: -2 });
      const data = {
        treatmentDates: {
          from: fromDate,
          to: toDate,
        },
      };
      validateToDate(errors, data, 'treatmentDates');
      expect(errorMessage).to.include(errorMessages.endDateBeforeStart);
      expect(errorMessage).to.include('other');
    });

    it('should handle missing dates object', () => {
      const data = {};
      validateToDate(errors, data, 'treatmentDates');
      expect(errorMessage[0]).to.eq(errorMessages.invalidDate);
    });

    it('should handle missing to date', () => {
      const data = {
        treatmentDates: {
          from: parseDateWithOffset({ months: -2 }),
        },
      };
      validateToDate(errors, data, 'treatmentDates');
      expect(errorMessage[0]).to.eq(errorMessages.invalidDate);
    });

    it('should add errors for both invalid to date and invalid range', () => {
      const data = {
        treatmentDates: {
          from: parseDateWithOffset({ weeks: -1 }),
          to: parseDateWithOffset({ months: -2 }),
        },
      };
      validateToDate(errors, data, 'treatmentDates');
      expect(errorMessage).to.include(errorMessages.endDateBeforeStart);
    });

    it('should allow same day for from and to dates', () => {
      const sameDate = parseDateWithOffset({ weeks: -1 });
      const data = {
        treatmentDates: {
          from: sameDate,
          to: sameDate,
        },
      };
      validateToDate(errors, data, 'treatmentDates');
      expect(errorMessage[0]).to.be.undefined;
    });

    it('should add range error when from date is invalid but to date is valid', () => {
      const data = {
        treatmentDates: {
          from: 'invalid-date',
          to: parseDateWithOffset({ weeks: -1 }),
        },
      };
      validateToDate(errors, data, 'treatmentDates');
      expect(errorMessage).to.include(errorMessages.endDateBeforeStart);
      expect(errorMessage).to.include('other');
    });
  });

  describe('isValidDate', () => {
    it('should return true for a date from a week ago', () => {
      const date = parseDateWithOffset({ weeks: -1 });
      expect(isValidDate(date)).to.be.true;
    });

    it('should return true for a date without a leading zero', () => {
      const date = '2020-1-1';
      expect(isValidDate(date)).to.be.true;
    });

    it('should return false for an invalid date', () => {
      expect(isValidDate('200')).to.be.false;
      expect(isValidDate('1899-01-01')).to.be.false;
      expect(isValidDate('2022-13-40')).to.be.false;
      expect(isValidDate('2023-?-05')).to.be.false;
      expect(isValidDate('2023-02-?')).to.be.false;
      expect(isValidDate('2023-02-29')).to.be.false;
      expect(isValidDate('1899')).to.be.false;
      expect(isValidDate(parseDateWithOffset({ weeks: 1 }))).to.be.false;
      expect(isValidDate(parseDate(new Date()))).to.be.false;
      expect(isValidDate(parseDateWithOffset({ years: -(MAX_YEARS_PAST + 1) })))
        .to.be.false;
      expect(isValidDate(parseDateWithOffset({ weeks: 1 }).substring(0, 8))).to
        .be.false;
      expect(
        isValidDate(parseDateWithOffset({ weeks: 1 }).replace(/-.*-/, '--')),
      ).to.be.false;
    });
  });

  describe('validateYMDate', () => {
    const fullData = {};
    const getYM = date => date.substring(0, 7);
    let errorMessage = [];
    const errors = {
      addError: message => {
        errorMessage.push(message || '');
      },
    };

    beforeEach(() => {
      errorMessage = [];
    });

    it('should allow valid dates', () => {
      const date = getYM(parseDateWithOffset({ weeks: -1 }));
      validateYMDate(errors, date, fullData);
      expect(errorMessage[0]).to.be.undefined;
    });

    it('should allow valid dates without a leading zero', () => {
      const date = '2020-1';
      validateYMDate(errors, date, fullData);
      expect(errorMessage[0]).to.be.undefined;
    });

    it('should throw a missing date error', () => {
      validateYMDate(errors, '200', fullData);
      expect(errorMessage.length).to.eq(0);
    });

    it('should throw a invalid date error', () => {
      validateYMDate(errors, '2023-13', fullData);
      expect(errorMessage[0]).to.eq(errorMessages.invalidDate);
    });

    it('should throw a range error for dates too old', () => {
      validateYMDate(errors, '1899-01', fullData);
      expect(errorMessage[0]).to.eq(scErrors.evidence.newerDate);
    });

    it('should throw an error for dates in the future', () => {
      const date = getYM(parseDateWithOffset({ weeks: 5 }));
      validateYMDate(errors, date, fullData);
      expect(errorMessage[0]).to.eq(scErrors.evidence.pastDate);
    });

    it('should throw an error for dates in the distant past', () => {
      const date = getYM(parseDateWithOffset({ years: -(MAX_YEARS_PAST + 1) }));
      validateYMDate(errors, date, fullData);
      expect(errorMessage[0]).to.contain(scErrors.evidence.newerDate);
    });

    it('should not throw an error for truncated dates', () => {
      // Testing 'YYYY-'
      validateYMDate(errors, '2000-', fullData);
      expect(errorMessage.length).to.eq(0);
    });

    it('should not throw an error for undefined date', () => {
      validateYMDate(errors, undefined, fullData);
      expect(errorMessage.length).to.eq(0);
    });

    it('should not throw an error for null date', () => {
      validateYMDate(errors, null, fullData);
      expect(errorMessage.length).to.eq(0);
    });

    it('should not throw an error for empty string', () => {
      validateYMDate(errors, '', fullData);
      expect(errorMessage.length).to.eq(0);
    });

    it('should not throw an error for short strings', () => {
      validateYMDate(errors, '2020', fullData);
      expect(errorMessage.length).to.eq(0);
      errorMessage = [];
      validateYMDate(errors, '20', fullData);
      expect(errorMessage.length).to.eq(0);
    });
  });
});
