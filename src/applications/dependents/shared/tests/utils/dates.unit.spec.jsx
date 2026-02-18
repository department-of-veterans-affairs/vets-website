import { expect } from 'chai';
import { format, sub } from 'date-fns';

import { getFormatedDate, calculateAge } from '../../utils';

describe('getFormatedDate', () => {
  it('should return empty string for undefined date', () => {
    const formattedDate = getFormatedDate();
    expect(formattedDate).to.equal('Unknown date');
  });

  it('should return empty string for invalid date', () => {
    const formattedDate = getFormatedDate('Summer 2000');
    expect(formattedDate).to.equal('Summer 2000');
  });

  it('should return formatted date for valid date', () => {
    const formattedDate = getFormatedDate('2020-01-01');
    expect(formattedDate).to.equal('January 1, 2020');
  });
  it('should return formatted date for valid Date object', () => {
    const formattedDate = getFormatedDate('12/05/2022', 'MM/dd/yyyy', 'PPPP');
    expect(formattedDate).to.equal('Monday, December 5th, 2022');
  });
});

describe('calculateAge', () => {
  it('should return 0 age and empty strings if dob is not provided', () => {
    const result = calculateAge();
    expect(result).to.deep.equal({
      age: 0,
      dobStr: '',
      labeledAge: '',
    });
  });

  it('should return 0 age and empty strings if dob is invalid', () => {
    const result = calculateAge('');
    expect(result).to.deep.equal({
      age: 0,
      dobStr: '',
      labeledAge: '',
    });
  });

  it('should return 0 age and correct dobStr for future dates', () => {
    const testDate = sub(new Date(), {
      months: -1,
    });
    const result = calculateAge(format(testDate, 'MM/dd/yyyy'));
    expect(result).to.deep.equal({
      age: 0,
      dobStr: format(testDate, 'MMMM d, yyyy'),
      labeledAge: 'Date in the future',
    });
  });

  it('should correctly calculate age an 18 year old', () => {
    const testDate = sub(new Date(), {
      years: 18,
      months: 1,
    });
    const result = calculateAge(format(testDate, 'MM/dd/yyyy'));
    expect(result).to.deep.equal({
      age: 18,
      dobStr: format(testDate, 'MMMM d, yyyy'),
      labeledAge: '18 years old',
    });
  });

  it('should correctly calculate age for a 1 year old', () => {
    const testDate = sub(new Date(), {
      years: 1,
      days: 3,
    });
    const result = calculateAge(format(testDate, 'MM/dd/yyyy'));
    expect(result).to.deep.equal({
      age: 1,
      dobStr: format(testDate, 'MMMM d, yyyy'),
      labeledAge: '1 year old',
    });
  });

  it('should correctly calculate age for a 4 month old', () => {
    const testDate = sub(new Date(), {
      months: 4,
      days: 3,
    });
    const result = calculateAge(format(testDate, 'MM/dd/yyyy'));
    expect(result).to.deep.equal({
      age: 0,
      dobStr: format(testDate, 'MMMM d, yyyy'),
      labeledAge: '4 months old',
    });
  });

  it('should correctly calculate age for a 1 month old', () => {
    const testDate = sub(new Date(), {
      months: 1,
      days: 1,
    });
    const result = calculateAge(format(testDate, 'MM/dd/yyyy'));
    expect(result).to.deep.equal({
      age: 0,
      dobStr: format(testDate, 'MMMM d, yyyy'),
      labeledAge: '1 month old',
    });
  });

  it('should correctly calculate age for a 10 day old', () => {
    const testDate = sub(new Date(), {
      days: 10,
    });
    const result = calculateAge(format(testDate, 'MM/dd/yyyy'));
    expect(result).to.deep.equal({
      age: 0,
      dobStr: format(testDate, 'MMMM d, yyyy'),
      labeledAge: '10 days old',
    });
  });

  it('should correctly calculate age for a 1 day old', () => {
    const testDate = sub(new Date(), {
      days: 1,
    });
    const result = calculateAge(format(testDate, 'MM/dd/yyyy'));
    expect(result).to.deep.equal({
      age: 0,
      dobStr: format(testDate, 'MMMM d, yyyy'),
      labeledAge: '1 day old',
    });
  });

  it('should correctly calculate age for a baby born today', () => {
    const testDate = new Date();
    const result = calculateAge(format(testDate, 'MM/dd/yyyy'));
    expect(result).to.deep.equal({
      age: 0,
      dobStr: format(testDate, 'MMMM d, yyyy'),
      labeledAge: 'Newborn',
    });
  });
});
