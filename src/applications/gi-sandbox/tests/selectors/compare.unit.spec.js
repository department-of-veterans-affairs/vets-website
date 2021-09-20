import { expect } from 'chai';

import {
  getCompareCalculatorState,
  updateUrlParams,
} from '../../selectors/compare';
import { getDefaultState } from '../helpers';

const defaultState = getDefaultState();

const institution = {
  tuitionInState: 13663,
  tuitionOutOfState: 13663,
  books: 1000,
  calendar: 'semesters',
  type: 'FOR PROFIT',
  country: 'USA',
  dodBah: 2000,
  bah: 2271.0,
  yellowRibbonPrograms: [
    {
      divisionProfessionalSchool: 'division1',
      degreeLevel: 'graduate',
      contributionAmount: 5000,
      numberOfStudents: 20,
    },
    {
      divisionProfessionalSchool: 'division2',
      degreeLevel: 'undergraduate',
      contributionAmount: 5,
      numberOfStudents: 25,
    },
    {
      divisionProfessionalSchool: 'division3',
      degreeLevel: 'undergraduate',
      contributionAmount: 25,
      numberOfStudents: 30,
    },
  ],
};

describe('getCompareCalculatorState', () => {
  it('should contain calculator properties', () => {
    const compareState = getCompareCalculatorState(
      defaultState.calculator,
      institution,
      defaultState.constants,
    );
    expect(compareState).to.have.any.keys(Object.keys(defaultState.calculator));
  });

  it('should return no for giBillBenefit for USA with dodBah less than bah', () => {
    const compareState = getCompareCalculatorState(
      defaultState.calculator,
      institution,
      defaultState.constants,
    );
    expect(compareState.giBillBenefit).to.equal('no');
  });

  it('should return yes for giBillBenefit for USA with dodBah greater than bah', () => {
    const compareState = getCompareCalculatorState(
      defaultState.calculator,
      { ...institution, dodBah: 3000, bah: 2500 },
      defaultState.constants,
    );
    expect(compareState.giBillBenefit).to.equal('yes');
  });

  it('should return yes for giBillBenefit for USA with no dodBah', () => {
    const compareState = getCompareCalculatorState(
      defaultState.calculator,
      { ...institution, dodBah: null },
      defaultState.constants,
    );
    expect(compareState.giBillBenefit).to.equal('yes');
  });

  it('should return value for giBillBenefit for non-USA based on constants', () => {
    const compareState = getCompareCalculatorState(
      defaultState.calculator,
      { ...institution, country: 'CAN' },
      defaultState.constants,
    );
    expect(compareState.giBillBenefit).to.equal('yes');
  });

  it('should return type', () => {
    const compareState = getCompareCalculatorState(
      defaultState.calculator,
      institution,
      defaultState.constants,
    );
    expect(compareState.type).to.equal(institution.type);
  });

  it('should return beneficiaryLocationBah', () => {
    const compareState = getCompareCalculatorState(
      defaultState.calculator,
      institution,
      defaultState.constants,
    );
    expect(compareState.beneficiaryLocationBah).to.be.null;
  });

  it('should return beneficiaryLocationGrandfatheredBah', () => {
    const compareState = getCompareCalculatorState(
      defaultState.calculator,
      institution,
      defaultState.constants,
    );
    expect(compareState.beneficiaryLocationGrandfatheredBah).to.be.null;
  });

  it('should return tuitionInState from institution', () => {
    const compareState = getCompareCalculatorState(
      defaultState.calculator,
      institution,
      defaultState.constants,
    );
    expect(compareState.tuitionInState).to.equal(institution.tuitionInState);
  });

  it('should return tuitionInState as 0', () => {
    const compareState = getCompareCalculatorState(
      defaultState.calculator,
      { ...institution, tuitionInState: null },
      defaultState.constants,
    );
    expect(compareState.tuitionInState).to.equal(0);
  });

  it('should return tuitionOutOfState from institution', () => {
    const compareState = getCompareCalculatorState(
      defaultState.calculator,
      institution,
      defaultState.constants,
    );
    expect(compareState.tuitionOutOfState).to.equal(
      institution.tuitionOutOfState,
    );
  });

  it('should return tuittuitionOutOfStateionInState as 0', () => {
    const compareState = getCompareCalculatorState(
      defaultState.calculator,
      { ...institution, tuitionOutOfState: null },
      defaultState.constants,
    );
    expect(compareState.tuitionOutOfState).to.equal(0);
  });

  it('should return tuitionFees as institution.tuitionInState', () => {
    const compareState = getCompareCalculatorState(
      defaultState.calculator,
      institution,
      defaultState.constants,
    );
    expect(compareState.tuitionFees).to.equal(institution.tuitionInState);
  });

  it('should return tuitionFees as 0', () => {
    const compareState = getCompareCalculatorState(
      defaultState.calculator,
      { ...institution, tuitionInState: null },
      defaultState.constants,
    );
    expect(compareState.tuitionFees).to.equal(0);
  });

  it('should return inStateTuitionFees as institution.tuitionInState', () => {
    const compareState = getCompareCalculatorState(
      defaultState.calculator,
      institution,
      defaultState.constants,
    );
    expect(compareState.inStateTuitionFees).to.equal(
      institution.tuitionInState,
    );
  });

  it('should return inStateTuitionFees as 0', () => {
    const compareState = getCompareCalculatorState(
      defaultState.calculator,
      { ...institution, tuitionInState: null },
      defaultState.constants,
    );
    expect(compareState.inStateTuitionFees).to.equal(0);
  });

  it('should return books from institution', () => {
    const compareState = getCompareCalculatorState(
      defaultState.calculator,
      institution,
      defaultState.constants,
    );
    expect(compareState.books).to.equal(institution.books);
  });

  it('should return books as 0', () => {
    const compareState = getCompareCalculatorState(
      defaultState.calculator,
      { ...institution, books: null },
      defaultState.constants,
    );
    expect(compareState.books).to.equal(0);
  });

  it('should return calendar from institution', () => {
    const compareState = getCompareCalculatorState(
      defaultState.calculator,
      institution,
      defaultState.constants,
    );
    expect(compareState.calendar).to.equal(institution.calendar);
  });

  it('should return calendar as semesters', () => {
    const compareState = getCompareCalculatorState(
      defaultState.calculator,
      { ...institution, calendar: null },
      defaultState.constants,
    );
    expect(compareState.calendar).to.equal('semesters');
  });

  it('returns default values for yellowRibbon values when no yellowRibbonPrograms', () => {
    const compareState = getCompareCalculatorState(
      defaultState.calculator,
      { ...institution, yellowRibbonPrograms: [] },
      defaultState.constants,
    );
    expect(compareState.yellowRibbonAmount).to.equal(0);
    expect(compareState.yellowRibbonDegreeLevel).to.equal('');
    expect(compareState.yellowRibbonDivision).to.equal('');
    expect(compareState.yellowRibbonDegreeLevelOptions).to.be.empty;
    expect(compareState.yellowRibbonDivisionOptions).to.be.empty;
    expect(compareState.yellowRibbonMaxAmount).to.be.undefined;
    expect(compareState.yellowRibbonMaxNumberOfStudents).to.be.undefined;
    expect(compareState.yellowRibbonPrograms).to.be.empty;
    expect(compareState.yellowRibbonProgramIndex).to.be.undefined;
  });

  it('returns yellowRibbonAmount as yellowRibbonPrograms[0].contributionAmount', () => {
    const compareState = getCompareCalculatorState(
      defaultState.calculator,
      institution,
      defaultState.constants,
    );
    expect(compareState.yellowRibbonAmount).to.equal(
      institution.yellowRibbonPrograms[0].contributionAmount,
    );
  });

  it('returns yellowRibbonDegreeLevel as yellowRibbonPrograms[0].degreeLevel', () => {
    const compareState = getCompareCalculatorState(
      defaultState.calculator,
      institution,
      defaultState.constants,
    );
    expect(compareState.yellowRibbonDegreeLevel).to.equal(
      institution.yellowRibbonPrograms[0].degreeLevel,
    );
  });

  it('returns yellowRibbonDivision as yellowRibbonPrograms[0].divisionProfessionalSchool', () => {
    const compareState = getCompareCalculatorState(
      defaultState.calculator,
      institution,
      defaultState.constants,
    );
    expect(compareState.yellowRibbonDivision).to.equal(
      institution.yellowRibbonPrograms[0].divisionProfessionalSchool,
    );
  });

  it('returns yellowRibbonDegreeLevelOptions as array of degreeLevel', () => {
    const compareState = getCompareCalculatorState(
      defaultState.calculator,
      institution,
      defaultState.constants,
    );
    const yellowRibbonDegreeLevelOptions = [
      ...new Set(
        institution.yellowRibbonPrograms.map(program => program.degreeLevel),
      ),
    ];
    expect(compareState.yellowRibbonDegreeLevelOptions)
      .to.be.an('array')
      .that.includes.members(yellowRibbonDegreeLevelOptions);
  });

  it('returns yellowRibbonDivisionOptions as array of degreeLevel', () => {
    const compareState = getCompareCalculatorState(
      defaultState.calculator,
      institution,
      defaultState.constants,
    );
    const yellowRibbonDivisionOptions = [
      ...new Set(
        institution.yellowRibbonPrograms
          .filter(
            program =>
              program.degreeLevel ===
              compareState.yellowRibbonDegreeLevelOptions[0],
          )
          .map(program => program.divisionProfessionalSchool),
      ),
    ];

    expect(compareState.yellowRibbonDivisionOptions)
      .to.be.an('array')
      .that.includes.members(yellowRibbonDivisionOptions);
  });

  it('returns yellowRibbonMaxAmount as yellowRibbonAmount', () => {
    const compareState = getCompareCalculatorState(
      defaultState.calculator,
      institution,
      defaultState.constants,
    );
    expect(compareState.yellowRibbonMaxAmount).to.equal(
      compareState.yellowRibbonAmount,
    );
  });

  it('returns yellowRibbonMaxNumberOfStudents as yellowRibbonPrograms[0].numberOfStudents', () => {
    const compareState = getCompareCalculatorState(
      defaultState.calculator,
      institution,
      defaultState.constants,
    );
    expect(compareState.yellowRibbonMaxNumberOfStudents).to.equal(
      institution.yellowRibbonPrograms[0].numberOfStudents,
    );
  });

  it('returns yellowRibbonPrograms as institution.yellowRibbonPrograms with indexes', () => {
    const compareState = getCompareCalculatorState(
      defaultState.calculator,
      institution,
      defaultState.constants,
    );
    const yellowRibbonPrograms = institution.yellowRibbonPrograms.map(
      (program, index) => ({
        ...program,
        index,
      }),
    );

    expect(compareState.yellowRibbonPrograms)
      .to.be.an('array')
      .that.deep.includes.members(yellowRibbonPrograms);
  });

  it('returns yellowRibbonProgramIndex as yellowRibbonPrograms[0].index', () => {
    const compareState = getCompareCalculatorState(
      defaultState.calculator,
      institution,
      defaultState.constants,
    );
    expect(compareState.yellowRibbonProgramIndex).to.equal(
      compareState.yellowRibbonPrograms[0].index,
    );
  });
});

describe('updateUrlParams', () => {
  it('returns url string with facility codes', () => {
    const facilityCodes = ['1', '2'];
    expect(updateUrlParams(facilityCodes)).to.equal(
      `/compare/?facilities=${facilityCodes.join(',')}`,
    );
  });

  it('returns url string with facility codes and version', () => {
    const facilityCodes = ['1', '2'];
    const version = 1;
    expect(updateUrlParams(facilityCodes, version)).to.equal(
      `/compare/?facilities=${facilityCodes.join(',')}&version=${version}`,
    );
  });
});
