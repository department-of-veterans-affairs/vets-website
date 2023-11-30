import { expect } from 'chai';
import {
  SEARCH_STARTED,
  SEARCH_FAILED,
  SEARCH_QUERY_UPDATED,
  GEOCODE_STARTED,
  CLEAR_SEARCH_TEXT,
  FETCH_REPRESENTATIVES,
  GEOLOCATE_USER,
  GEOCODE_FAILED,
  GEOCODE_COMPLETE,
  GEOCODE_CLEAR_ERROR,
} from '../../utils/actionTypes';
import {
  SearchQueryReducer,
  INITIAL_STATE,
  validateForm,
} from '../../reducers/searchQuery';

describe('search query reducer', () => {
  it('should handle search started', () => {
    const state = SearchQueryReducer(INITIAL_STATE, {
      type: SEARCH_STARTED,
    });

    expect(state.error).to.eql(false);
    expect(state.inProgress).to.eql(true);
  });

  it('should handle fetching list of representatives', () => {
    const state = SearchQueryReducer(
      {
        ...INITIAL_STATE,
        locationInputString: 'test',
        representativeType: 'test',
        inProgress: true,
        error: true,
        searchWithInputInProgress: true,
      },
      {
        type: FETCH_REPRESENTATIVES,
      },
    );

    expect(state.error).to.eql(false);
    expect(state.isValid).to.eql(true);
    expect(state.inProgress).to.eql(false);
    expect(state.searchWithInputInProgress).to.eql(false);
  });

  it('should handle search failed', () => {
    const state = SearchQueryReducer(
      {
        ...INITIAL_STATE,
        error: false,
        inProgress: true,
      },
      {
        type: SEARCH_FAILED,
      },
    );

    expect(state.error).to.eql(true);
    expect(state.inProgress).to.eql(false);
    expect(state.searchWithInputInProgress).to.eql(false);
  });

  it('should handle search query updated', () => {
    const state = SearchQueryReducer(
      {
        ...INITIAL_STATE,
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
    expect(state.isValid).to.eql(false);
  });

  it('should handle geocode started', () => {
    const state = SearchQueryReducer(INITIAL_STATE, {
      type: GEOCODE_STARTED,
    });

    expect(state.error).to.eql(false);
    expect(state.geocodeInProgress).to.eql(true);
  });

  it('should handle geolocate user', () => {
    const state = SearchQueryReducer(INITIAL_STATE, {
      type: GEOLOCATE_USER,
    });

    expect(state.geolocationInProgress).to.eql(true);
  });

  it('should handle geocode failed', () => {
    const action = {
      type: GEOCODE_FAILED,
      payload: { geocodeError: -1 },
    };
    const state = SearchQueryReducer(INITIAL_STATE, {
      type: GEOCODE_FAILED,
    });

    expect(action.payload.geocodeError).to.eql(-1);
    expect(state.geocodeInProgress).to.eql(false);
    expect(state.geolocationInProgress).to.eql(false);
  });

  it('should handle geocode complete', () => {
    const state = SearchQueryReducer(INITIAL_STATE, {
      type: GEOCODE_COMPLETE,
    });

    expect(state.geocodeInProgress).to.eql(false);
    expect(state.geolocationInProgress).to.eql(false);
  });

  it('should handle geocode clear error', () => {
    const state = SearchQueryReducer(INITIAL_STATE, {
      type: GEOCODE_CLEAR_ERROR,
    });

    expect(state.geocodeError).to.eql(0);
    expect(state.geocodeInProgress).to.eql(false);
    expect(state.geolocationInProgress).to.eql(false);
  });

  describe('isValid', () => {
    it('should be true with locationInputString and representativeType', () => {
      const state = SearchQueryReducer(INITIAL_STATE, {
        type: SEARCH_QUERY_UPDATED,
        payload: {
          locationInputString: 'test',
          representativeType: 'test',
        },
      });
      expect(state.isValid).to.eql(true);
      expect(state.locationChanged).to.eql(true);
      expect(state.representativeTypeChanged).to.eql(true);
    });

    it('should be false with only representativeType', () => {
      const state = SearchQueryReducer(INITIAL_STATE, {
        type: SEARCH_QUERY_UPDATED,
        payload: {
          representativeType: 'test',
        },
      });
      expect(state.isValid).to.eql(false);
      expect(state.locationChanged).to.eql(false);
      expect(state.representativeTypeChanged).to.eql(true);
    });

    it('should be true with locationInputString and representativeType', () => {
      const state = SearchQueryReducer(INITIAL_STATE, {
        type: SEARCH_QUERY_UPDATED,
        payload: {
          locationInputString: 'test',
          representativeType: 'provider',
        },
      });
      expect(state.isValid).to.eql(true);
      expect(state.locationChanged).to.eql(true);
      expect(state.representativeTypeChanged).to.eql(true);
    });
  });

  it('should invalidate form when clearing search text', () => {
    const state = SearchQueryReducer(
      { ...INITIAL_STATE, locationInputString: 'Austin' },
      {
        type: CLEAR_SEARCH_TEXT,
      },
    );

    expect(state.isValid).to.eql(false);
    expect(state.locationInputString).to.eql('');
    expect(state.locationChanged).to.eql(true);
    expect(state.representativeTypeChanged).to.be.undefined;
  });
});

describe('validateForm function', () => {
  it('should return true when passed a valid state object', () => {
    const oldState = {
      ...INITIAL_STATE,
    };
    const payload = {
      locationInputString: 'test',
      representativeType: 'test',
    };
    const result = validateForm(oldState, payload);
    expect(result.isValid).to.eql(true);
  });

  it('should return false when passed an invalid state object', () => {
    const oldState = {
      ...INITIAL_STATE,
    };
    const payload = {
      locationInputString: null,
      representativeType: '',
    };
    const result = validateForm(oldState, payload);
    expect(result.isValid).to.eql(false);
  });

  it('should return true when location is changed', () => {
    const oldState = {
      ...INITIAL_STATE,
    };
    const payload = {
      locationInputString: 'new string',
    };
    const result = validateForm(oldState, payload);
    expect(result.locationChanged).to.eql(true);
  });
});
