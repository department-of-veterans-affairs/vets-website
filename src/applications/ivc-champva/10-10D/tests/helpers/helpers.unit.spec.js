import { expect } from 'chai';
import { applicantWording } from '../../helpers/wordingCustomization';
import { getAgeInYears, isInRange, getParts } from '../../helpers/utilities';

describe('applicantWording helper', () => {
  it('should concatenate first and last names', () => {
    expect(
      applicantWording({
        applicantName: { first: 'firstname', last: 'lastname' },
      }),
    ).to.equal("firstname lastname's ");
  });
});

describe('getAgeInYears helper', () => {
  const year = Number(
    new Date()
      .getFullYear()
      .toString()
      .slice(-2),
  );

  it('should return the proper age in years', () => {
    expect(getAgeInYears('2000-01-01')).to.equal(year);
  });
});

describe('isInRange helper', () => {
  it('should return true if number in range', () => {
    expect(isInRange(22, 18, 23)).to.be.true;
  });
  it('should return false if number not in range', () => {
    expect(isInRange(25, 18, 23)).to.be.false;
  });
});

describe('getParts helper', () => {
  it('should clean up presentation of medicare part text', () => {
    expect(getParts('partA, partB, partD')).to.equal('Part A, Part B');
  });
});
