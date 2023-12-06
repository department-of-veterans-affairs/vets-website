import { expect } from 'chai';

import filterReducer from '../../reducers/filters';

const initialState = {
  expanded: false,
  search: false,
  schools: false,
  excludedSchoolTypes: [],
  excludeCautionFlags: false,
  accredited: false,
  studentVeteran: false,
  yellowRibbonScholarship: false,
  specialMission: 'ALL',
  employers: false,
  vettec: false,
  preferredProvider: false,
  country: 'ALL',
  state: 'ALL',
};

describe('filter reducer', () => {
  it('should change filter successfully', () => {
    const state = filterReducer(initialState, {
      type: 'INSTITUTION_FILTER_CHANGED',
      filter: {
        expanded: false,
        search: false,
        schools: true,
        excludedSchoolTypes: [],
        excludeCautionFlags: false,
        accredited: false,
        studentVeteran: false,
        yellowRibbonScholarship: false,
        specialMission: 'ALL',
        employers: true,
        vettec: true,
        preferredProvider: false,
        country: 'ALL',
        state: 'ALL',
      },
    });

    expect(state.schools).to.eql(false);
    expect(state.excludeCautionFlags).to.eql(false);
    expect(state.accredited).to.eql(false);
    expect(state.studentVeteran).to.eql(false);
    expect(state.yellowRibbonScholarship).to.eql(false);
    expect(state.specialMission).to.eql('ALL');
    expect(state.employers).to.eql(false);
    expect(state.vettec).to.eql(false);
    expect(state.preferredProvider).to.eql(false);
    expect(state.country).to.eql('ALL');
    expect(state.state).to.eql('ALL');
  });
  it('should convert string "true" and "false" to boolean values and update state', () => {
    const initialState2 = {
      expanded: false,
      search: false,
      schools: false,
      excludedSchoolTypes: [],
      excludeCautionFlags: false,
      accredited: false,
      studentVeteran: false,
      yellowRibbonScholarship: false,
      specialMission: 'ALL',
      employers: false,
      vettec: false,
      preferredProvider: false,
      country: 'ALL',
      state: 'ALL',
    };

    const action = {
      type: 'UPDATE_QUERY_PARAMS',
      payload: {
        search: 'true',
        accredited: 'false',
      },
    };

    const newState = filterReducer(initialState2, action);
    expect(newState.search).to.be.true;
    expect(newState.accredited).to.be.false;
    expect(newState.schools).to.be.false;
    expect(newState.country).to.equal('ALL');
  });
});
