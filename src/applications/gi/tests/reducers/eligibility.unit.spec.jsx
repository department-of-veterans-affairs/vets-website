import { expect } from 'chai';

import eligibilityReducer from '../../reducers/eligibility';

const initialState = {
  militaryStatus: 'veteran',
  giBillChapter: '33',
  cumulativeService: '1.0',
  onlineClasses: 'no',
  spouseActiveDuty: 'no',
  enlistmentService: '3',
  consecutiveService: '0.8',
  eligForPostGiBill: 'yes',
  numberOfDependents: '0',
};

describe('eligibility reducer', () => {
  it('should reset spouse active duty field after choosing military status', () => {
    const state = eligibilityReducer(
      {
        ...initialState,
        militaryStatus: 'spouse',
        spouseActiveDuty: 'no',
      },
      {
        type: 'ELIGIBILITY_CHANGED',
        payload: {
          militaryStatus: 'veteran',
        },
      },
    );

    expect(state.militaryStatus).to.eql('veteran');
    expect(state.spouseActiveDuty).to.eql('no');
  });

  it('should reset fields after choosing GI Bill', () => {
    const state = eligibilityReducer(
      {
        ...initialState,
        giBillChapter: '30',
        eligForPostGiBill: 'yes',
      },
      {
        type: 'ELIGIBILITY_CHANGED',
        payload: {
          giBillChapter: '33',
        },
      },
    );

    delete state.timestamp;
    expect(state.giBillChapter).to.eql('33');
    expect(state.eligForPostGiBill).to.eql('no');
  });
});
