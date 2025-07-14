import { expect } from 'chai';

import { processDependents } from '../../helpers';

describe('processDependents', () => {
  it('should return an empty array when no dependents are provided', () => {
    const result = processDependents([]);
    expect(result).to.deep.equal([]);
  });

  it('should fallback to default values', () => {
    const input = [{ awardIndicator: 'Y' }];
    const result = processDependents(input);
    expect(result[0].dob).to.equal('');
    expect(result[0].ssn).to.equal('');
    expect(result[0].fullName).to.equal('');
    expect(result[0].age).to.equal('');
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
