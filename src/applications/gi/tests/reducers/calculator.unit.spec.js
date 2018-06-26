import { expect } from 'chai';

import calculatorReducer from '../../reducers/calculator';

describe('calculator reducer', () => {
  it('should correctly change non-dollar input', () => {
    const state = calculatorReducer(
      {},
      {
        type: 'CALCULATOR_INPUTS_CHANGED',
        field: 'field',
        value: 'value'
      }
    );

    expect(state).to.eql({ field: 'value' });
  });

  it('should correctly change dollar input', () => {
    const state = calculatorReducer(
      {},
      {
        type: 'CALCULATOR_INPUTS_CHANGED',
        field: 'tuitionFees',
        value: '$1000.00'
      }
    );

    expect(state).to.eql({ tuitionFees: 1000 });
  });

  it('should correctly change inState input and set inState tuition', () => {
    const state = calculatorReducer(
      { tuitionInState: 10 },
      {
        type: 'CALCULATOR_INPUTS_CHANGED',
        field: 'inState',
        value: 'yes'
      }
    );

    expect(state).to.eql({
      tuitionInState: 10,
      inState: 'yes',
      inStateTuitionFees: 10,
      tuitionFees: 10,
    });
  });

  it('should correctly change inState input and set out of state tuition', () => {
    const state = calculatorReducer(
      { tuitionOutOfState: 100, tuitionInState: 10 },
      {
        type: 'CALCULATOR_INPUTS_CHANGED',
        field: 'inState',
        value: 'no'
      }
    );

    expect(state).to.eql({
      tuitionOutOfState: 100,
      inStateTuitionFees: 10,
      inState: 'no',
      tuitionInState: 10,
      tuitionFees: 100,
    });
  });

  it('should update yellowRibbonDivisionOptions, yellowRibbonDivison, and yellowRibbonAmount when yellowRibbonDegreeLevel is changed', () => {
    const previousState = {
      yellowRibbonPrograms: [
        {
          divisionProfessionalSchool: 'division1',
          degreeLevel: 'graduate',
          contributionAmount: 5000,
          index: 0,
          numberOfStudents: 20
        },
        {
          divisionProfessionalSchool: 'division2',
          degreeLevel: 'undergraduate',
          contributionAmount: 5,
          index: 1,
          numberOfStudents: 25
        },
        {
          divisionProfessionalSchool: 'division3',
          degreeLevel: 'undergraduate',
          contributionAmount: 25,
          index: 2,
          numberOfStudents: 30
        }
      ]
    };
    const state = calculatorReducer(
      previousState,
      {
        type: 'CALCULATOR_INPUTS_CHANGED',
        field: 'yellowRibbonDegreeLevel',
        value: 'undergraduate'
      }
    );

    expect(state).to.eql({
      ...previousState,
      yellowRibbonDegreeLevel: 'undergraduate',
      yellowRibbonDivisionOptions: ['division2', 'division3'],
      yellowRibbonDivision: 'division2',
      yellowRibbonAmount: 5,
      yellowRibbonProgramIndex: 1,
      yellowRibbonMaxAmount: 5,
      yellowRibbonMaxNumberOfStudents: 25
    });
  });


  it('should update yellowRibbonAmount when yellowRibbonDivision is changed', () => {
    const previousState = {
      yellowRibbonDegreeLevel: 'undergraduate',
      yellowRibbonPrograms: [
        {
          divisionProfessionalSchool: 'division1',
          degreeLevel: 'graduate',
          contributionAmount: 5000,
          index: 0,
          numberOfStudents: 20
        },
        {
          divisionProfessionalSchool: 'division2',
          degreeLevel: 'undergraduate',
          contributionAmount: 5,
          index: 1,
          numberOfStudents: 25
        },
        {
          divisionProfessionalSchool: 'division3',
          degreeLevel: 'undergraduate',
          contributionAmount: 25,
          index: 2,
          numberOfStudents: 30
        }
      ]
    };
    const state = calculatorReducer(
      previousState,
      {
        type: 'CALCULATOR_INPUTS_CHANGED',
        field: 'yellowRibbonDivision',
        value: 'division3'
      }
    );

    expect(state).to.eql({
      ...previousState,
      yellowRibbonDegreeLevel: 'undergraduate',
      yellowRibbonDivision: 'division3',
      yellowRibbonAmount: 25,
      yellowRibbonMaxAmount: 25,
      yellowRibbonMaxNumberOfStudents: 30,
      yellowRibbonProgramIndex: 2
    });
  });


  it('should add yellowRibbonDegreeLevelOptions, yellowRibbonDivisonOptions, yellowRibbonAmount, yellowRibbonDegreeLevel, and yellowRibbonDivision when institution has yellowRibbonPrograms', () => {
    const state = calculatorReducer(
      {},
      {
        type: 'FETCH_PROFILE_SUCCEEDED',
        payload: {
          data: {
            attributes: {
              yellowRibbonPrograms: [
                {
                  divisionProfessionalSchool: 'division1',
                  degreeLevel: 'graduate',
                  contributionAmount: 5000,
                  numberOfStudents: 20
                },
                {
                  divisionProfessionalSchool: 'division2',
                  degreeLevel: 'undergraduate',
                  contributionAmount: 5,
                  numberOfStudents: 25
                },
                {
                  divisionProfessionalSchool: 'division3',
                  degreeLevel: 'undergraduate',
                  contributionAmount: 25,
                  numberOfStudents: 30
                }
              ]
            }
          }
        }
      }
    );

    expect(state).to.include({
      yellowRibbonDegreeLevel: 'graduate',
      yellowRibbonDivision: 'division1',
      yellowRibbonAmount: 5000,
      yellowRibbonMaxNumberOfStudents: 20,
      yellowRibbonMaxAmount: 5000,
      yellowRibbonProgramIndex: 0
    });
    expect(state.yellowRibbonDivisionOptions).to.eql(['division1']);
    expect(state.yellowRibbonDegreeLevelOptions).to.eql(['graduate', 'undergraduate']);
    expect(state.yellowRibbonPrograms).to.eql([
      {
        divisionProfessionalSchool: 'division1',
        degreeLevel: 'graduate',
        contributionAmount: 5000,
        index: 0,
        numberOfStudents: 20
      },
      {
        divisionProfessionalSchool: 'division2',
        degreeLevel: 'undergraduate',
        contributionAmount: 5,
        index: 1,
        numberOfStudents: 25
      },
      {
        divisionProfessionalSchool: 'division3',
        degreeLevel: 'undergraduate',
        contributionAmount: 25,
        index: 2,
        numberOfStudents: 30
      }
    ]);
  });
});
