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
  test('should handle fetching a single facility', () => {
    const state = SearchResultReducer(INITIAL_STATE, {
      type: FETCH_LOCATION_DETAIL,
      payload: {
        name: 'selectedResult',
      },
    });

    expect(state.selectedResult).toEqual({ name: 'selectedResult' });
  });

  test('should handle fetching a list of facilities', () => {
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

    expect(state.results.length).toBe(2);
    expect(state.pagination.currentPage).toBe(1);
  });

  test('should handle fetching state to build a search query object', () => {
    const state = SearchResultReducer(INITIAL_STATE, {
      type: FETCH_LOCATIONS,
      payload: {
        data: [
          {
            attributes: {
              name: 'Test VA facility',
              facilityType: 'Test health',
              classification: 'Test medical center',
              lat: 40.7365270700001,
              long: -73.97761421,
              address: {
                physical: {
                  zip: '10010',
                  city: 'New York',
                  state: 'NY',
                  address1: '123 East 33rd Street',
                },
              },
            },
          },
        ],
        meta: {
          pagination: {
            currentPage: 1,
          },
        },
      },
    });

    expect(state.results.length).toBe(1);
    expect(state.results[0].attributes.name).toBe('Test VA facility');
    expect(state.results[0].attributes.facilityType).toBe('Test health');
    expect(state.results[0].attributes.classification).toBe(
      'Test medical center',
    );
    expect(state.results[0].attributes.lat).toBe(40.7365270700001);
    expect(state.results[0].attributes.long).toEqual(-73.97761421);
    expect(state.results[0].attributes.address.physical.zip).toBe('10010');
    expect(state.results[0].attributes.address.physical.city).toBe('New York');
    expect(state.results[0].attributes.address.physical.state).toBe('NY');
    expect(state.results[0].attributes.address.physical.address1).toBe(
      '123 East 33rd Street',
    );
    expect(state.pagination.currentPage).toBe(1);
  });

  test('should handle failure case', () => {
    const state = SearchResultReducer(INITIAL_STATE, {
      type: SEARCH_FAILED,
    });

    expect(state).toEqual(INITIAL_STATE);
  });

  test('should handle clearing search results', () => {
    const state = SearchResultReducer(INITIAL_STATE, {
      type: CLEAR_SEARCH_RESULTS,
    });

    expect(state).toEqual(INITIAL_STATE);
  });
});
