// Dependencies.
import { expect } from 'chai';
// Relative imports.
import { FETCH_RESULTS, FETCH_RESULTS_SUCCESS } from '../constants';
import { yellowRibbonReducer } from '.';

describe('Yellow Ribbon reducer', () => {
  it('returns the default state', () => {
    const emptyAction = {};
    const result = yellowRibbonReducer(undefined, emptyAction);

    expect(result).to.be.deep.equal({
      error: '',
      fetching: false,
      hasFetchedOnce: false,
      page: 1,
      perPage: 10,
      results: undefined,
      schoolIDs: [],
      schoolsLookup: {},
      showMobileForm: true,
      isToolTipOpen: false,
      totalResults: undefined,
    });
  });

  it('fetches results', () => {
    const action = {
      type: FETCH_RESULTS,
      options: {
        city: 'boulder',
        hideFetchingState: true,
        name: 'university',
        state: 'CO',
      },
    };
    const state = yellowRibbonReducer(undefined, action);

    expect(state).to.be.deep.equal({
      error: '',
      fetching: false,
      hasFetchedOnce: true,
      page: 1,
      perPage: 10,
      results: undefined,
      schoolIDs: [],
      schoolsLookup: {},
      showMobileForm: false,
      isToolTipOpen: false,
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
