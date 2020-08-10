import { expect } from 'chai';
import {
  SEARCH_STARTED,
  SEARCH_FAILED,
  SEARCH_QUERY_UPDATED,
  FETCH_LOCATION_DETAIL,
  FETCH_LOCATIONS,
  FETCH_SPECIALTIES,
  FETCH_SPECIALTIES_DONE,
  FETCH_SPECIALTIES_FAILED,
} from '../../utils/actionTypes';
import { SearchQueryReducer } from '../../reducers/searchQuery';

const INITIAL_STATE = {
  searchString: '',
  serviceType: null,
  facilityType: 'all', // default to All Facilities
  position: {
    latitude: 40.17887331434698,
    longitude: -99.27246093750001,
  },
  bounds: [-77.53653, 38.3976763, -76.53653, 39.3976763],
  context: '20004',
  currentPage: 1,
  zoomLevel: 4,
  inProgress: false,
  searchBoundsInProgress: false,
  fetchSvcsInProgress: false,
};

describe('search query reducer', () => {
  it('should handle search started', () => {
    const state = SearchQueryReducer(INITIAL_STATE, {
      type: SEARCH_STARTED,
    });

    expect(state.error).to.eql(false);
    expect(state.inProgress).to.eql(true);
  });

  it('should handle fetching list of facilities', () => {
    const state = SearchQueryReducer(
      {
        inProgress: true,
        error: true,
        searchBoundsInProgress: true,
      },
      {
        type: FETCH_LOCATIONS,
      },
    );

    expect(state.error).to.eql(false);
    expect(state.inProgress).to.eql(false);
    expect(state.searchBoundsInProgress).to.eql(false);
  });

  it('should handle fetching single facility', () => {
    const state = SearchQueryReducer(
      {
        error: true,
        inProgress: true,
      },
      {
        type: FETCH_LOCATION_DETAIL,
      },
    );

    expect(state.error).to.eql(false);
    expect(state.inProgress).to.eql(false);
  });

  it('should handle search failed', () => {
    const state = SearchQueryReducer(
      {
        error: false,
        inProgress: true,
      },
      {
        type: SEARCH_FAILED,
      },
    );

    expect(state.error).to.eql(true);
    expect(state.inProgress).to.eql(false);
  });

  it('should handle search query updated', () => {
    const state = SearchQueryReducer(
      {
        error: true,
      },
      {
        type: SEARCH_QUERY_UPDATED,
        payload: {
          attribute: true,
        },
      },
    );

    expect(state.error).to.eql(false);
    expect(state.attribute).to.eql(true);
  });

  it('should handle fetching services', () => {
    const state = SearchQueryReducer(INITIAL_STATE, {
      type: FETCH_SPECIALTIES,
    });

    expect(state.error).to.eql(false);
    expect(state.fetchSvcsInProgress).to.eql(true);
  });

  it('should handle provider services fetched', () => {
    const state = SearchQueryReducer(INITIAL_STATE, {
      type: FETCH_SPECIALTIES_DONE,
    });

    expect(state.error).to.eql(false);
    expect(state.fetchSvcsInProgress).to.eql(false);
  });

  it('should handle failed fetching provider services', () => {
    const state = SearchQueryReducer(INITIAL_STATE, {
      type: FETCH_SPECIALTIES_FAILED,
    });

    expect(state.error).to.eql(true);
    expect(state.fetchSvcsInProgress).to.eql(false);
  });
});
