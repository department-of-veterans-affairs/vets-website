// Dependencies.
import { expect } from 'chai';
// relative imports
import { DW_UPDATE_FIELD } from '../../constants';
import dischargeWizard from '../../reducers/discharge-wizard';

describe('Discharge Wizard single reducer', () => {
  const initialState = {
    '1_branchOfService': null, // 4
    '2_dischargeYear': '', // 2
    '3_dischargeMonth': '', // 2a
    '4_reason': null, // 1
    '5_dischargeType': null, // 1a
    '6_intention': null, // 1b
    '7_courtMartial': null, // 3
    '8_prevApplication': null, // 5
    '9_prevApplicationYear': null, // 5a
    '10_prevApplicationType': null, // 5b
    '11_failureToExhaust': null, // 5c
    '12_priorService': null, // 6
    questions: ['1_branchOfService'], // represents valid question progression
  };

  it('returns default state', () => {
    const emptyAction = {};
    const result = dischargeWizard(undefined, emptyAction);

    expect(result).to.be.deep.equal(initialState);
  });

  it('1_branchOfService is updated and next questions is added to array ', () => {
    const action = {
      type: DW_UPDATE_FIELD,
      key: '1_branchOfService',
      value: 'Army',
    };
    const result = dischargeWizard(initialState, action);

    expect(result).to.be.deep.equal({
      ...initialState,
      '1_branchOfService': 'Army',
      questions: ['1_branchOfService', '2_dischargeYear'],
    });
  });
});
