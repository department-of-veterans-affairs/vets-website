import filterReducer from '../../reducers/filter';

const initialState = {
  category: 'ALL',
  type: 'ALL',
  country: 'ALL',
  state: 'ALL',
  studentVeteranGroup: false,
  yellowRibbonScholarship: false,
  principlesOfExcellence: false,
  eightKeysToVeteranSuccess: false,
  priorityEnrollment: false,
  independentStudy: false,
  stemIndicator: false,
  typeName: 'ALL',
};

describe('filter reducer', () => {
  it('should change filter successfully', () => {
    const state = filterReducer(initialState, {
      type: 'INSTITUTION_FILTER_CHANGED',
      filter: {
        category: 'ALL',
        distanceLearning: false,
        type: 'ALL',
        country: 'ALL',
        state: 'WA',
        studentVeteranGroup: false,
        yellowRibbonScholarship: false,
        principlesOfExcellence: true,
        eightKeysToVeteranSuccess: false,
        onlineOnly: false,
        priorityEnrollment: false,
        independentStudy: false,
        stemIndicator: true,
        typeName: 'ALL',
      },
    });

    expect(state.category).toBe('ALL');
    expect(state.distanceLearning).toBe(false);
    expect(state.type).toBe('ALL');
    expect(state.country).toBe('ALL');
    expect(state.state).toBe('WA');
    expect(state.studentVeteranGroup).toBe(false);
    expect(state.yellowRibbonScholarship).toBe(false);
    expect(state.onlineOnly).toBe(false);
    expect(state.principlesOfExcellence).toBe(true);
    expect(state.eightKeysToVeteranSuccess).toBe(false);
    expect(state.independentStudy).toBe(false);
    expect(state.eightKeysToVeteranSuccess).toBe(false);
    expect(state.stemIndicator).toBe(true);
    expect(state.typeName).toBe('ALL');
  });
});
