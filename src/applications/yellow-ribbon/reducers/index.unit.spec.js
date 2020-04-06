// Dependencies.
import { FETCH_RESULTS, FETCH_RESULTS_SUCCESS } from '../constants';
import { yellowRibbonReducer } from './index';

describe('Yellow Ribbon reducer', () => {
  it('returns the default state', () => {
    const emptyAction = {};
    const result = yellowRibbonReducer(undefined, emptyAction);

    expect(result).toEqual({
      error: '',
      fetching: false,
      hasFetchedOnce: false,
      page: 1,
      perPage: 10,
      results: undefined,
      schoolIDs: [],
      schoolsLookup: {},
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

    expect(state).toEqual({
      error: '',
      fetching: false,
      hasFetchedOnce: true,
      page: 1,
      perPage: 10,
      results: undefined,
      schoolIDs: [],
      schoolsLookup: {},
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

    expect(state.fetching).toBe(false);
    expect(state.results).toBeInstanceOf(Array);
  });
});
