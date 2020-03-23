// Dependencies.
import { expect } from 'chai';
// Relative imports.
import { FETCH_RESULTS, FETCH_RESULTS_SUCCESS } from '../constants';
import { yellowRibbonReducer } from './index';

describe('Yellow Ribbon reducer', () => {
  it('returns the default state', () => {
    const emptyAction = {};
    const result = yellowRibbonReducer(undefined, emptyAction);

    expect(result).to.be.deep.equal({
      city: '',
      contributionAmount: '',
      country: '',
      error: '',
      fetching: false,
      name: '',
      numberOfStudents: '',
      page: 1,
      perPage: 10,
      results: undefined,
      schoolIDs: [],
      schoolsLookup: {},
      state: '',
      totalResults: undefined,
    });
  });

  it('fetches results', () => {
    const action = {
      type: FETCH_RESULTS,
      options: {
        city: 'boulder',
        country: 'usa',
        hideFetchingState: true,
        name: 'university',
        state: 'CO',
      },
    };
    const state = yellowRibbonReducer(undefined, action);

    expect(state).to.be.deep.equal({
      city: 'boulder',
      contributionAmount: '',
      country: 'usa',
      error: '',
      fetching: false,
      name: 'university',
      numberOfStudents: '',
      page: 1,
      perPage: 10,
      results: undefined,
      schoolIDs: [],
      schoolsLookup: {},
      state: 'CO',
      totalResults: undefined,
    });
  });

  it('receives results', () => {
    const initialState = {
      fetching: true,
      results: undefined,
    };
    const action = { type: FETCH_RESULTS_SUCCESS, response: { results: [] } };
    const state = yellowRibbonReducer(initialState, action);

    expect(state.fetching).to.be.false;
    expect(state.results).to.be.instanceOf(Array);
  });
});
