import { expect } from 'chai';

import { getDate } from '../../utils/dates';
import { validateDate, isValidDate } from '../../validations/date';

describe('validateDate & isValidDate', () => {
  let errorMessage = '';
  const errors = {
    addError: message => {
      errorMessage = message || '';
    },
  };

  beforeEach(() => {
    errorMessage = '';
  });

  it('should allow valid dates', () => {
    const date = getDate({ offset: { weeks: -1 } });
    validateDate(errors, date);
    expect(errorMessage).to.equal('');
    expect(isValidDate(date)).to.be.true;
  });
  it('should throw a invalid date error', () => {
    validateDate(errors, '200');
    expect(errorMessage).to.contain('provide a valid date');
    expect(isValidDate('200')).to.be.false;
  });
  it('should throw a range error for dates too old', () => {
    validateDate(errors, '1899-01-01');
    expect(errorMessage).to.contain('enter a year between');
    expect(isValidDate('1899')).to.be.false;
  });
  it('should throw an error for dates in the future', () => {
    const date = getDate({ offset: { weeks: 1 } });
    validateDate(errors, date);
    expect(errorMessage).to.contain('past decision date');
    expect(isValidDate(date)).to.be.false;
  });
  it('should throw an error for todays date', () => {
    const date = getDate();
    validateDate(errors, date);
    expect(errorMessage).to.contain('past decision date');
    expect(isValidDate(date)).to.be.false;
  });
  it('should throw an error for dates more than a year in the past', () => {
    const date = getDate({ offset: { weeks: -60 } });
    validateDate(errors, date);
    expect(errorMessage).to.contain('date less than a year');
    expect(isValidDate(date)).to.be.false;
  });
  it('should throw a invalid date for truncated dates', () => {
    // Testing 'YYYY-MM-' (contact center reported errors; FE seeing this)
    const date = getDate({ offset: { weeks: 1 } }).substring(0, 8);
    validateDate(errors, date);
    expect(errorMessage).to.contain('provide a valid date');
    expect(isValidDate(date)).to.be.false;
  });
  it('should throw a invalid date for truncated dates', () => {
    // Testing 'YYYY--DD' (contact center reported errors; BE seeing this)
    const date = getDate({ offset: { weeks: 1 } }).replace(/-.*-/, '--');
    validateDate(errors, date);
    expect(errorMessage).to.contain('provide a valid date');
    expect(isValidDate(date)).to.be.false;
  });
});
