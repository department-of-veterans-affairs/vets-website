import { expect } from 'chai';

import { validateDate, isValidDate } from '../../validations/date';

import errorMessages from '../../../shared/content/errorMessages';
import { parseDate, parseDateWithOffset } from '../../../shared/utils/dates';
import { MAX_YEARS_PAST } from '../../../shared/constants';

describe('validateDate & isValidDate', () => {
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
    const date = parseDateWithOffset({ weeks: -1 });
    validateDate(errors, date);
    expect(errorMessage[0]).to.be.undefined;
    expect(isValidDate(date)).to.be.true;
  });
  it('should allow valid dates without a leading zero', () => {
    const today = new Date();
    const year = today.getFullYear();
    // getMonth => zero based month; we're trying to process a single digit
    // month and day here
    const date = today.getMonth() > 9 ? `${year}-1-1` : `${year - 1}-12-31`;
    validateDate(errors, date);
    expect(errorMessage[0]).to.be.undefined;
    expect(isValidDate(date)).to.be.true;
  });
  it('should throw a invalid date error', () => {
    validateDate(errors, '200');
    expect(errorMessage[0]).to.eq(errorMessages.decisions.blankDate);
    expect(errorMessage[1]).to.contain('month');
    expect(errorMessage[1]).to.contain('day');
    expect(errorMessage[1]).to.not.contain('year');
    expect(errorMessage[1]).to.contain('other');
    expect(isValidDate('200')).to.be.false;
  });
  it('should throw a invalid date error', () => {
    validateDate(errors, '2023-02-29'); // max 28 days
    expect(errorMessage[0]).to.eq(errorMessages.invalidDate);
    expect(errorMessage[1]).to.not.contain('month');
    expect(errorMessage[1]).to.contain('day');
    expect(errorMessage[1]).to.not.contain('year');
    expect(errorMessage[1]).to.contain('other');
    expect(isValidDate('2023-02-29')).to.be.false;
  });
  it('should throw a range error for dates too old', () => {
    validateDate(errors, '1899-01-01');
    expect(errorMessage[0]).to.eq(errorMessages.decisions.newerDate);
    expect(errorMessage[1]).to.not.contain('month');
    expect(errorMessage[1]).to.not.contain('day');
    expect(errorMessage[1]).to.contain('year');
    expect(errorMessage[1]).to.not.contain('other');
    expect(isValidDate('1899')).to.be.false;
  });
  it('should throw an error for dates in the future', () => {
    const date = parseDateWithOffset({ weeks: 1 });
    validateDate(errors, date);
    expect(errorMessage[0]).to.match(
      /The date must be before [A-Za-z]+\.? \d+, \d{4}\./,
    );
    expect(errorMessage[1]).to.not.contain('month');
    expect(errorMessage[1]).to.not.contain('day');
    expect(errorMessage[1]).to.contain('year');
    expect(errorMessage[1]).to.not.contain('other');
    expect(isValidDate(date)).to.be.false;
  });
  it('should throw an error for todays date', () => {
    const date = parseDate(new Date());
    validateDate(errors, date);
    expect(errorMessage[0]).to.match(
      /The date must be before [A-Za-z]+\.? \d+, \d{4}\./,
    );
    expect(errorMessage[1]).to.not.contain('month');
    expect(errorMessage[1]).to.not.contain('day');
    expect(errorMessage[1]).to.contain('year');
    expect(errorMessage[1]).to.not.contain('other');
    expect(isValidDate(date)).to.be.false;
  });
  it('should throw a invalid date for truncated dates', () => {
    // Testing 'YYYY-MM-' (contact center reported errors; FE seeing this)
    const date = parseDateWithOffset({ weeks: 1 }).substring(0, 8);
    validateDate(errors, date);
    expect(errorMessage[0]).to.eq(errorMessages.decisions.blankDate);
    expect(errorMessage[1]).to.not.contain('month');
    expect(errorMessage[1]).to.contain('day');
    expect(errorMessage[1]).to.not.contain('year');
    expect(errorMessage[1]).to.contain('other');
    expect(isValidDate(date)).to.be.false;
  });
  it('should throw a invalid date for truncated dates', () => {
    // Testing 'YYYY--DD' (contact center reported errors; BE seeing this)
    const date = parseDateWithOffset({ weeks: 1 }).replace(/-.*-/, '--');
    validateDate(errors, date);
    expect(errorMessage[0]).to.eq(errorMessages.decisions.blankDate);
    expect(errorMessage[1]).to.contain('month');
    expect(errorMessage[1]).to.not.contain('day');
    expect(errorMessage[1]).to.not.contain('year');
    expect(errorMessage[1]).to.contain('other');
    expect(isValidDate(date)).to.be.false;
  });
  it('should not throw an error for dates > 1 year in the past to support the new form', () => {
    const date = parseDateWithOffset({ years: -2 });
    validateDate(errors, date, {});
    expect(errorMessage[0]).to.be.undefined;
  });
  it('should throw an error for dates in the distant past to support the new form', () => {
    const date = parseDateWithOffset({ years: -(MAX_YEARS_PAST + 10) });
    validateDate(errors, date, {});
    expect(errorMessage[0]).to.eq(errorMessages.decisions.newerDate);
    expect(errorMessage[1]).to.not.contain('month');
    expect(errorMessage[1]).to.not.contain('day');
    expect(errorMessage[1]).to.contain('year');
    expect(errorMessage[1]).to.not.contain('other');
    expect(isValidDate(date)).to.be.false;
  });
});
