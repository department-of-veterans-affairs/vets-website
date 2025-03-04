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

  it('should clear error after a successful search', () => {
    const state = SearchResultReducer(
      { ...INITIAL_STATE, error: true },
      {
        type: FETCH_LOCATIONS,
        payload: {
          data: [{ name: 'selectedResult1' }, { name: 'selectedResult2' }],
          meta: {
            pagination: {
              currentPage: 1,
            },
          },
        },
      },
    );

    expect(state.error).to.be.null;
  });

  it('should handle fetching state to build a search query object', () => {
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

    expect(state.results.length).to.eql(1);
    expect(state.results[0].attributes.name).to.eql('Test VA facility');
    expect(state.results[0].attributes.facilityType).to.eql('Test health');
    expect(state.results[0].attributes.classification).to.eql(
      'Test medical center',
    );
    expect(state.results[0].attributes.lat).to.eql(40.7365270700001);
    expect(state.results[0].attributes.long).to.eql(-73.97761421);
    expect(state.results[0].attributes.address.physical.zip).to.eql('10010');
    expect(state.results[0].attributes.address.physical.city).to.eql(
      'New York',
    );
    expect(state.results[0].attributes.address.physical.state).to.eql('NY');
    expect(state.results[0].attributes.address.physical.address1).to.eql(
      '123 East 33rd Street',
    );
    expect(state.pagination.currentPage).to.eql(1);
  });

  it('should handle failure case', () => {
    const state = SearchResultReducer(INITIAL_STATE, {
      type: SEARCH_FAILED,
    });

    expect(state).to.eql(INITIAL_STATE);
  });

  it('should handle selecting a mobile map pin', () => {
    const payload = { test: 'test' };

    const state = SearchResultReducer(INITIAL_STATE, {
      type: MOBILE_MAP_PIN_SELECTED,
      payload,
    });

    expect(state).to.eql({
      ...INITIAL_STATE,
      mobileMapPinSelected: payload,
    });
  });

  it('should handle clearing search results', () => {
    const state = SearchResultReducer(INITIAL_STATE, {
      type: CLEAR_SEARCH_RESULTS,
    });

    expect(state).to.eql(INITIAL_STATE);
  });
});
