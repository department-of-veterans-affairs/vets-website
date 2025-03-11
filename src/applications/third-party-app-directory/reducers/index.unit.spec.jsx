// Node modules.
import { expect } from 'chai';
// Relative imports.
import { FETCH_RESULTS, FETCH_RESULTS_SUCCESS } from '../constants';
import { thirdPartyAppsReducer } from './index';

describe('reducer', () => {
  it('returns the default state', () => {
    const emptyAction = {};
    const result = thirdPartyAppsReducer(undefined, emptyAction);

    expect(result).to.be.deep.equal({
      error: '',
      fetching: false,
      results: undefined,
      scopes: {},
      totalResults: undefined,
    });
  });

  it('fetches results', () => {
    const action = {
      type: FETCH_RESULTS,
      options: {
        category: 'health',
        hideFetchingState: true,
        platform: 'ios',
      },
    };
    const state = thirdPartyAppsReducer(undefined, action);

    expect(state).to.be.deep.equal({
      error: '',
      fetching: false,
      results: undefined,
      scopes: {},
      totalResults: undefined,
    });
  });

  it('receives results', () => {
    const initialState = {
      fetching: true,
      results: undefined,
    };
    const action = { type: FETCH_RESULTS_SUCCESS, response: { results: [] } };
    const state = thirdPartyAppsReducer(initialState, action);

    expect(state.fetching).to.be.false;
    expect(state.results).to.be.instanceOf(Object);
  });
});
