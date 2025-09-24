import { expect } from 'chai';
import { sub, format } from 'date-fns';

import { hasSession, calculateAge, processDependents } from '../../helpers';

describe('hasSession', () => {
  it('should return true if hasSession is set to true in localStorage', () => {
    localStorage.setItem('hasSession', 'true');
    expect(hasSession()).to.be.true;
  });
  it('should return false if hasSession is not set in localStorage', () => {
    localStorage.removeItem('hasSession');
    expect(hasSession()).to.be.false;
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
      labeledAge: '',
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

describe('processDependents', () => {
  it('should return an empty array when no dependents are provided', () => {
    expect(processDependents()).to.deep.equal([]);
    expect(processDependents([])).to.deep.equal([]);
  });

  it('should fallback to default values', () => {
    const input = [{ awardIndicator: 'Y' }];
    const result = processDependents(input);
    expect(result[0].dob).to.equal('');
    expect(result[0].ssn).to.equal('');
    expect(result[0].fullName).to.equal('');
    expect(result[0].age).to.equal(0);
    expect(result[0].removalDate).to.equal('');
  });

  it('should filter out dependents without awardIndicator "Y"', () => {
    const input = [
      { awardIndicator: 'N', firstName: 'John' },
      { awardIndicator: 'Y', firstName: 'Jane' },
    ];
    const result = processDependents(input);
    expect(result).to.have.lengthOf(1);
    expect(result[0].firstName).to.equal('Jane');
  });

  it('should format date of birth and calculate age correctly', () => {
    const input = [
      {
        awardIndicator: 'Y',
        dateOfBirth: '01/01/2000',
        firstName: 'John',
        lastName: 'Doe',
        ssn: '123456789',
      },
    ];
    const result = processDependents(input);
    expect(result[0].dob).to.equal('January 1, 2000');
    expect(result[0].age).to.be.a('number');
  });

  it('should mask SSN to last four digits', () => {
    const input = [
      {
        awardIndicator: 'Y',
        dateOfBirth: '01/01/2000',
        firstName: 'John',
        lastName: 'Doe',
        ssn: '123456789',
      },
    ];
    const result = processDependents(input);
    expect(result[0].ssn).to.equal('6789');
  });

  it('should handle removalDate formatting', () => {
    const input = [
      {
        awardIndicator: 'Y',
        dateOfBirth: '01/01/2000',
        firstName: 'John',
        lastName: 'Doe',
        ssn: '123456789',
        upcomingRemoval: '12/31/2025',
      },
    ];
    const result = processDependents(input);
    expect(result[0].removalDate).to.equal('December 31, 2025');
  });
});
