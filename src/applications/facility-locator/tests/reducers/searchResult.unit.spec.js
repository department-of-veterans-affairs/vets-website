import { expect } from 'chai';

import {
  FETCH_LOCATION_DETAIL,
  FETCH_LOCATIONS,
  SEARCH_FAILED,
  CLEAR_SEARCH_RESULTS,
} from '../../utils/actionTypes';
import { SearchResultReducer } from '../../reducers/searchResult';

const INITIAL_STATE = {
  results: [],
  selectedResult: null,
  pagination: {},
};

describe('facilities reducer', () => {
  it('should handle fetching a single facility', () => {
    const state = SearchResultReducer(INITIAL_STATE, {
      type: FETCH_LOCATION_DETAIL,
      payload: {
        name: 'selectedResult',
      },
    });

    expect(state.selectedResult).to.eql({ name: 'selectedResult' });
  });

  it('should handle fetching a list of facilities', () => {
    const state = SearchResultReducer(INITIAL_STATE, {
      type: FETCH_LOCATIONS,
      payload: {
        data: [{ name: 'selectedResult1' }, { name: 'selectedResult2' }],
        meta: {
          pagination: {
            currentPage: 1,
          },
        },
      },
    });

    expect(state.results.length).to.eql(2);
    expect(state.pagination.currentPage).to.eql(1);
  });

  it('should handle failure case', () => {
    const state = SearchResultReducer(INITIAL_STATE, {
      type: SEARCH_FAILED,
    });

    expect(state).to.eql(INITIAL_STATE);
  });

  it('should handle clearing search results', () => {
    const state = SearchResultReducer(INITIAL_STATE, {
      type: CLEAR_SEARCH_RESULTS,
    });

    expect(state).to.eql(INITIAL_STATE);
  });
});
