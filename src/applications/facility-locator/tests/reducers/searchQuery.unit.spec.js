import { expect } from 'chai';
import {
  SEARCH_STARTED,
  SEARCH_QUERY_UPDATED,
  SEARCH_FAILED,
  FETCH_LOCATION_DETAIL,
  FETCH_LOCATIONS,
} from '../../utils/actionTypes';
import { SearchQueryReducer } from '../../reducers/searchQuery';

const INITIAL_STATE = {
  searchString: '',
  serviceType: null,
  facilityType: null,
  position: {
    latitude: 38.8976763,
    longitude: -77.03653,
  },
  bounds: [-77.53653, 38.3976763, -76.53653, 39.3976763],
  context: 20004,
  inProgress: false,
  currentPage: 1,
  zoomLevel: 11,
  searchBoundsInProgress: false,
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
});
