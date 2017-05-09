import { expect } from 'chai';

import filterReducer from '../../../src/js/gi/reducers/filter.js';

const initialState = {
  category: 'ALL',
  type: 'ALL',
  country: 'ALL',
  state: 'ALL',
  studentVeteranGroup: false,
  yellowRibbonScholarship: false,
  principlesOfExcellence: false,
  eightKeysToVeteranSuccess: false,
  typeName: 'ALL',
};

describe('filter reducer', () => {
  it('should change filter successfully', () => {
    const state = filterReducer(
      initialState,
      {
        type: 'INSTITUTION_FILTER_CHANGED',
        filter: {
          category: 'ALL',
          type: 'ALL',
          country: 'ALL',
          state: 'WA',
          studentVeteranGroup: false,
          yellowRibbonScholarship: false,
          principlesOfExcellence: true,
          eightKeysToVeteranSuccess: false,
          typeName: 'ALL'
        },
      }
    );

    expect(state.category).to.be.eq('ALL');
    expect(state.type).to.be.eq('ALL');
    expect(state.country).to.be.eq('ALL');
    expect(state.state).to.be.eq('WA');
    expect(state.studentVeteranGroup).to.be.eq(false);
    expect(state.yellowRibbonScholarship).to.be.eq(false);
    expect(state.principlesOfExcellence).to.be.eq(true);
    expect(state.eightKeysToVeteranSuccess).to.be.eq(false);
    expect(state.typeName).to.be.eq('ALL');
  });
});
