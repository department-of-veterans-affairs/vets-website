import { expect } from 'chai';

import { validateDate, isValidDate } from '../../validations/date';
import { errorMessages } from '../../constants';

import { getDate } from '../../../shared/utils/dates';
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
    const date = getDate({ offset: { weeks: -1 } });
    validateDate(errors, date);
    expect(errorMessage[0]).to.be.undefined;
    expect(isValidDate(date)).to.be.true;
  });
  it('should allow valid dates without a leading zero', () => {
    const date = '2020-1-1';
    validateDate(errors, date);
    expect(errorMessage[0]).to.be.undefined;
    expect(isValidDate(date)).to.be.true;
  });
  it('should throw a missing date error', () => {
    validateDate(errors, '200');
    expect(errorMessage[0]).to.eq(errorMessages.decisions.blankDate);
    expect(errorMessage[1]).to.contain('month');
    expect(errorMessage[1]).to.contain('day');
    expect(errorMessage[1]).to.not.contain('year');
    expect(errorMessage[1]).to.contain('other');
    expect(isValidDate('200')).to.be.false;
  });
  it('should throw a missing date error when month is a symbol', () => {
    validateDate(errors, '2023-?-05'); // "?" for month
    expect(errorMessage[0]).to.eq(errorMessages.decisions.blankDate);
    expect(errorMessage[1]).to.not.contain('month');
    expect(errorMessage[1]).to.not.contain('day');
    expect(errorMessage[1]).to.not.contain('year');
    expect(errorMessage[1]).to.contain('other');
    expect(isValidDate('2023-?-05')).to.be.false;
  });
  it('should throw a missing date error when day is a symbol', () => {
    validateDate(errors, '2023-02-?'); // "?" for day
    expect(errorMessage[0]).to.eq(errorMessages.decisions.blankDate);
    expect(errorMessage[1]).to.not.contain('month');
    expect(errorMessage[1]).to.not.contain('day');
    expect(errorMessage[1]).to.not.contain('year');
    expect(errorMessage[1]).to.contain('other');
    expect(isValidDate('2023-02-?')).to.be.false;
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
    const date = getDate({ offset: { weeks: 1 } });
    validateDate(errors, date);
    expect(errorMessage[0]).to.eq(errorMessages.decisions.pastDate);
    expect(errorMessage[1]).to.not.contain('month');
    expect(errorMessage[1]).to.not.contain('day');
    expect(errorMessage[1]).to.contain('year');
    expect(errorMessage[1]).to.not.contain('other');
    expect(isValidDate(date)).to.be.false;
  });
  it('should throw an error for todays date', () => {
    const date = getDate();
    validateDate(errors, date);
    expect(errorMessage[0]).to.eq(errorMessages.decisions.pastDate);
    expect(errorMessage[1]).to.not.contain('month');
    expect(errorMessage[1]).to.not.contain('day');
    expect(errorMessage[1]).to.contain('year');
    expect(errorMessage[1]).to.not.contain('other');
    expect(isValidDate(date)).to.be.false;
  });
  it('should throw an error for dates in the distant past', () => {
    const date = getDate({ offset: { years: -(MAX_YEARS_PAST + 1) } });
    validateDate(errors, date);
    expect(errorMessage[0]).to.contain(errorMessages.decisions.newerDate);
    expect(errorMessage[1]).to.not.contain('month');
    expect(errorMessage[1]).to.not.contain('day');
    expect(errorMessage[1]).to.contain('year');
    expect(errorMessage[1]).to.not.contain('other');
    expect(isValidDate(date)).to.be.false;
  });
  it('should throw a invalid date for truncated dates', () => {
    // Testing 'YYYY-MM-' (contact center reported errors; FE seeing this)
    const date = getDate({ offset: { weeks: 1 } }).substring(0, 8);
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
    const date = getDate({ offset: { weeks: 1 } }).replace(/-.*-/, '--');
    validateDate(errors, date);
    expect(errorMessage[0]).to.eq(errorMessages.decisions.blankDate);
    expect(errorMessage[1]).to.contain('month');
    expect(errorMessage[1]).to.not.contain('day');
    expect(errorMessage[1]).to.not.contain('year');
    expect(errorMessage[1]).to.contain('other');
    expect(isValidDate(date)).to.be.false;
  });
});
