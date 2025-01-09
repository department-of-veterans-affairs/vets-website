import { expect } from 'chai';
import {
  deriveDegreeLevel,
  deriveMaxAmount,
  deriveEligibleStudents,
  formatDegree,
} from '../../../components/profile/YellowRibbonTableRows';

describe('Test deriveDegreeLevel function', () => {
  it('should return "Not provided" if degreeLevel is undefined or null', () => {
    expect(deriveDegreeLevel(undefined)).to.equal('Not provided');
    expect(deriveDegreeLevel(null)).to.equal('Not provided');
  });

  it('should return the provided degree level when degreeLevel is defined', () => {
    expect(deriveDegreeLevel('Bachelor')).to.equal('Bachelor');
    expect(deriveDegreeLevel('Master')).to.equal('Master');
  });
});

describe('Test deriveMaxAmount function', () => {
  it('should return "Not provided" if contributionAmount is undefined or null', () => {
    expect(deriveMaxAmount(undefined)).to.equal('Not provided');
    expect(deriveMaxAmount(null)).to.equal('Not provided');
  });

  it('should return correct formatted contribution amount for a valid number', () => {
    expect(deriveMaxAmount('5000')).to.equal('$5,000');
    expect(deriveMaxAmount('10000')).to.equal('$10,000');
  });

  it('should return "Pays remaining tuition that Post-9/11 GI Bill doesn\'t cover" if contributionAmount is 99999 or greater', () => {
    expect(deriveMaxAmount('99999')).to.equal(
      "Pays remaining tuition that Post-9/11 GI Bill doesn't cover",
    );
    expect(deriveMaxAmount('100000')).to.equal(
      "Pays remaining tuition that Post-9/11 GI Bill doesn't cover",
    );
  });
});

describe('Test deriveEligibleStudents function', () => {
  it('should return "Not provided" if numberOfStudents is null or undefined', () => {
    expect(deriveEligibleStudents(undefined)).to.equal('Not provided');
    expect(deriveEligibleStudents(null)).to.equal('Not provided');
  });

  it('should return the number of students with "students" suffix', () => {
    expect(deriveEligibleStudents(50)).to.equal('50 students');
    expect(deriveEligibleStudents(100)).to.equal('100 students');
  });

  it('should return "All eligible students" if numberOfStudents is 99999 or greater', () => {
    expect(deriveEligibleStudents(99999)).to.equal('All eligible students');
    expect(deriveEligibleStudents(100000)).to.equal('All eligible students');
  });
});

describe('Test formatDegree function', () => {
  it('should format degreeLevel with a comma separator into first/second format', () => {
    expect(formatDegree('Bachelor, Master')).to.equal('Bachelor/Master');
  });
});
