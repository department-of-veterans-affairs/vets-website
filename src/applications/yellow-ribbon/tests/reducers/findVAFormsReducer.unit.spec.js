// Dependencies.
import { expect } from 'chai';
// Relative imports.
import { FETCH_RESULTS, FETCH_RESULTS_SUCCESS } from '../../constants';
import yellowRibbonReducer from '../../reducers/yellowRibbonReducer';

describe('Yellow Ribbon reducer: yellowRibbonReducer', () => {
  it('returns the default state', () => {
    const emptyAction = {};
    const result = yellowRibbonReducer(undefined, emptyAction);

    expect(result).to.be.deep.equal({
      error: '',
      fetching: false,
      page: 1,
      query: '',
      results: null,
      startIndex: 0,
    });
  });

  it('fetches results', () => {
    const action = { type: FETCH_RESULTS, query: 'testing' };
    const state = yellowRibbonReducer(undefined, action);

    expect(state).to.be.deep.equal({
      error: '',
      fetching: true,
      page: 1,
      query: 'testing',
      results: null,
      startIndex: 0,
    });
  });

  it('receives results', () => {
    const initialState = {
      fetching: true,
      results: null,
    };
    const action = { type: FETCH_RESULTS_SUCCESS, results: [] };
    const state = yellowRibbonReducer(initialState, action);

    expect(state.fetching).to.be.false;
    expect(state.results).to.be.instanceOf(Array);
  });
});
