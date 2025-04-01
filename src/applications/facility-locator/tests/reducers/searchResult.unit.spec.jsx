import { expect } from 'chai';

import {
  FETCH_LOCATION_DETAIL,
  FETCH_LOCATIONS,
  SEARCH_FAILED,
  CLEAR_SEARCH_RESULTS,
  MOBILE_MAP_PIN_SELECTED,
} from '../../actions/actionTypes';
import {
  INITIAL_STATE,
  SearchResultReducer,
} from '../../reducers/searchResult';

describe('facilities reducer', () => {
  it('should handle activity with no state passed in', () => {
    const state = SearchResultReducer(undefined, {
      type: FETCH_LOCATIONS,
      payload: {
        data: {},
        meta: {
          pagination: {},
          resultTime: undefined,
        },
      },
    });

    expect(state).to.deep.equal({
      ...INITIAL_STATE,
      error: null,
      results: {},
      pagination: {},
      resultTime: undefined,
    });
  });

  const locationsData = [
    { name: 'selectedResult1' },
    { name: 'selectedResult2' },
  ];

  const metaData = {
    pagination: {
      currentPage: 1,
    },
  };

  it('should return the correct data for FETCH_LOCATIONS', () => {
    const state = SearchResultReducer(INITIAL_STATE, {
      type: FETCH_LOCATIONS,
      payload: {
        data: locationsData,
        meta: metaData,
      },
    });

    expect(state).to.deep.equal({
      ...INITIAL_STATE,
      error: null,
      results: locationsData,
      pagination: {
        currentPage: 1,
      },
      resultTime: undefined,
    });
  });

  it('should return the correct data for FETCH_LOCATIONS to clear an error', () => {
    const state = SearchResultReducer(
      { ...INITIAL_STATE, error: true },
      {
        type: FETCH_LOCATIONS,
        payload: {
          data: locationsData,
          meta: metaData,
        },
      },
    );

    expect(state).to.deep.equal({
      ...INITIAL_STATE,
      error: null,
      pagination: metaData.pagination,
      resultTime: undefined,
      results: locationsData,
    });
  });

  it('should return the correct data for FETCH_LOCATIONS to build a search query object', () => {
    const data = [
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
    ];

    const state = SearchResultReducer(INITIAL_STATE, {
      type: FETCH_LOCATIONS,
      payload: {
        data,
        meta: metaData,
      },
    });

    expect(state).to.deep.equal({
      ...INITIAL_STATE,
      error: null,
      results: data,
      pagination: metaData.pagination,
      resultTime: undefined,
    });
  });

  it('should return the correct data for FETCH_LOCATION_DETAIL', () => {
    const state = SearchResultReducer(INITIAL_STATE, {
      type: FETCH_LOCATION_DETAIL,
      payload: {
        name: 'selectedResult',
      },
    });

    expect(state).to.deep.equal({
      ...INITIAL_STATE,
      selectedResult: { name: 'selectedResult' },
    });
  });

  it('should return the correct data for SEARCH_FAILED with a given error', () => {
    const state = SearchResultReducer(INITIAL_STATE, {
      type: SEARCH_FAILED,
      error: 'this is an error',
    });

    expect(state).to.deep.equal({
      ...INITIAL_STATE,
      error: 'this is an error',
    });
  });

  it('should return the correct data for SEARCH_FAILED without a given error', () => {
    const state = SearchResultReducer(INITIAL_STATE, {
      type: SEARCH_FAILED,
    });

    expect(state).to.deep.equal({
      ...INITIAL_STATE,
    });
  });

  it('should return the correct data for MOBILE_MAP_PIN_SELECTED', () => {
    const payload = { test: 'test' };

    const state = SearchResultReducer(INITIAL_STATE, {
      type: MOBILE_MAP_PIN_SELECTED,
      payload,
    });

    expect(state).to.deep.equal({
      ...INITIAL_STATE,
      mobileMapPinSelected: payload,
    });
  });

  it('should return the correct data for CLEAR_SEARCH_RESULTS', () => {
    const state = SearchResultReducer(INITIAL_STATE, {
      type: CLEAR_SEARCH_RESULTS,
    });

    expect(state).to.deep.equal(INITIAL_STATE);
  });

  it('should return the correct data for a RANDOM_ACTION', () => {
    const state = SearchResultReducer(INITIAL_STATE, {
      type: 'RANDOM_ACTION',
    });

    expect(state).to.deep.equal({
      ...INITIAL_STATE,
    });
  });
});
