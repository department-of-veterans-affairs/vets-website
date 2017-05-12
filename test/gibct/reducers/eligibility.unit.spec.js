import { expect } from 'chai';

import eligibilityReducer from '../../../src/js/gi/reducers/eligibility.js';

const initialState = {
  dropdowns: {
    militaryStatus: true,
    spouseActiveDuty: false,
    giBillChapter: true,
    cumulativeService: true,
    enlistmentService: false,
    consecutiveService: false,
    eligForPostGiBill: false,
    numberOfDependents: false
  },
  militaryStatus: 'veteran',
  giBillChapter: '33',
  cumulativeService: '1.0',
  onlineClasses: 'no',
  spouseActiveDuty: 'no',
  enlistmentService: '3',
  consecutiveService: '0.8',
  eligForPostGiBill: 'no',
  numberOfDependents: '0',
};

describe('eligibility reducer', () => {
  it('should update eligibility for militaryStatus field', () => {
    const state = eligibilityReducer(
      initialState,
      {
        type: 'ELIGIBILITY_CHANGED',
        field: 'militaryStatus',
        value: 'spouse'
      }
    );

    expect(state.militaryStatus).to.be.eql('spouse');
    expect(state.dropdowns.spouseActiveDuty).to.be.eql(true);
  });

  it('should update eligibility for giBillChapter field', () => {
    const state = eligibilityReducer(
      initialState,
      {
        type: 'ELIGIBILITY_CHANGED',
        field: 'giBillChapter',
        value: '30'
      }
    );

    expect(state.giBillChapter).to.be.eql('30');
    expect(state.dropdowns.enlistmentService).to.be.eql(true);
    expect(state.dropdowns.cumulativeService).to.be.eql(false);
    expect(state.dropdowns.consecutiveService).to.be.eql(false);
  });

  it('should update eligibility for general field', () => {
    const state = eligibilityReducer(
      initialState,
      {
        type: 'ELIGIBILITY_CHANGED',
        field: 'fieldName',
        value: 'fieldValue'
      }
    );

    expect(state.fieldName).to.be.eql('fieldValue');
  });
});
