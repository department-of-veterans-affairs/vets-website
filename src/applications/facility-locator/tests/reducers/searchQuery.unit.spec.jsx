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
  GEOCODE_STARTED,
  GEOCODE_FAILED,
  GEOCODE_COMPLETE,
  GEOCODE_CLEAR_ERROR,
  MAP_MOVED,
  CLEAR_SEARCH_TEXT,
  GEOLOCATE_USER,
} from '../../actions/actionTypes';
import {
  SearchQueryReducer,
  INITIAL_STATE,
  validateForm,
} from '../../reducers/searchQuery';

describe('search query reducer', () => {
  it('should handle activity with no state passed in', () => {
    const state = SearchQueryReducer(undefined, {
      type: GEOCODE_STARTED,
    });

    expect(state).to.deep.equal({
      ...INITIAL_STATE,
      error: false,
      geocodeInProgress: true,
    });
  });

  it('should return the correct data for SEARCH_STARTED', () => {
    const state = SearchQueryReducer(INITIAL_STATE, {
      type: SEARCH_STARTED,
    });

    expect(state).to.deep.equal({
      ...INITIAL_STATE,
      error: false,
      inProgress: true,
      mapMoved: false,
      searchStarted: true,
    });
  });

  it('should return the correct data for FETCH_LOCATIONS', () => {
    const state = SearchQueryReducer(
      {
        ...INITIAL_STATE,
        searchString: 'test',
        facilityType: 'test',
        inProgress: true,
        error: true,
        searchBoundsInProgress: true,
      },
      {
        type: FETCH_LOCATIONS,
      },
    );

    expect(state).to.deep.equal({
      ...INITIAL_STATE,
      error: false,
      inProgress: false,
      searchBoundsInProgress: false,
      mapMoved: false,
      isValid: true,
      facilityType: 'test',
      facilityTypeChanged: false,
      locationChanged: false,
      searchString: 'test',
      serviceTypeChanged: false,
    });
  });

  it('should return the correct data for MAP_MOVED', () => {
    const state = SearchQueryReducer(INITIAL_STATE, {
      type: MAP_MOVED,
      currentRadius: 10,
    });

    expect(state).to.deep.equal({
      ...INITIAL_STATE,
      mapMoved: true,
      currentRadius: 10,
    });
  });

  it('should return the correct data for FETCH_LOCATION_DETAIL', () => {
    const state = SearchQueryReducer(
      {
        ...INITIAL_STATE,
        error: true,
        inProgress: true,
      },
      {
        type: FETCH_LOCATION_DETAIL,
      },
    );

    expect(state).to.deep.equal({
      ...INITIAL_STATE,
      error: false,
      inProgress: false,
      mapMoved: false,
      facilityTypeChanged: false,
      isValid: false,
      locationChanged: false,
      serviceTypeChanged: false,
    });
  });

  it('should return the correct data for FETCH_SPECIALTIES', () => {
    const state = SearchQueryReducer(INITIAL_STATE, {
      type: FETCH_SPECIALTIES,
    });

    expect(state).to.deep.equal({
      ...INITIAL_STATE,
      fetchSvcsError: null,
      fetchSvcsInProgress: true,
      specialties: {},
      fetchSvcsRawData: [],
    });
  });

  it('should return the correct data for FETCH_SPECIALTIES_DONE for given specialties', () => {
    const state = SearchQueryReducer(INITIAL_STATE, {
      type: FETCH_SPECIALTIES_DONE,
      data: [{ specialtyCode: 'foo', name: 'bar' }],
    });

    expect(state).to.deep.equal({
      ...INITIAL_STATE,
      error: false,
      fetchSvcsError: null,
      fetchSvcsInProgress: false,
      fetchSvcsRawData: [{ specialtyCode: 'foo', name: 'bar' }],
      specialties: { foo: 'bar' },
    });
  });

  it('should return the correct data for FETCH_SPECIALTIES_DONE for no given specialties', () => {
    const state = SearchQueryReducer(INITIAL_STATE, {
      type: FETCH_SPECIALTIES_DONE,
    });

    expect(state).to.deep.equal({
      ...INITIAL_STATE,
      error: false,
      fetchSvcsError: null,
      fetchSvcsInProgress: false,
      fetchSvcsRawData: undefined,
      specialties: null,
    });
  });

  it('should return the correct data for FETCH_SPECIALTIES_FAILED when an error is not passed', () => {
    const state = SearchQueryReducer(INITIAL_STATE, {
      type: FETCH_SPECIALTIES_FAILED,
    });

    expect(state).to.deep.equal({
      ...INITIAL_STATE,
      error: true,
      fetchSvcsInProgress: false,
      fetchSvcsError: true,
      facilityType: '',
      isValid: true,
    });
  });

  it('should return the correct data for FETCH_SPECIALTIES_FAILED when an error is passed', () => {
    const state = SearchQueryReducer(INITIAL_STATE, {
      type: FETCH_SPECIALTIES_FAILED,
      error: 'some error text',
    });

    expect(state).to.deep.equal({
      ...INITIAL_STATE,
      error: true,
      fetchSvcsInProgress: false,
      fetchSvcsError: 'some error text',
      facilityType: '',
      isValid: true,
    });
  });

  it('should return the correct data for SEARCH_FAILED', () => {
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

    expect(state).to.deep.equal({
      ...INITIAL_STATE,
      error: true,
      inProgress: false,
      searchBoundsInProgress: false,
    });
  });

  it('should return the correct data for SEARCH_QUERY_UPDATED', () => {
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

    expect(state).to.deep.equal({
      ...INITIAL_STATE,
      error: false,
      attribute: true,
      isValid: false,
      facilityTypeChanged: false,
      locationChanged: false,
      serviceTypeChanged: false,
    });
  });

  it('should return the correct data for GEOCODE_STARTED', () => {
    const state = SearchQueryReducer(INITIAL_STATE, { type: GEOCODE_STARTED });

    expect(state).to.deep.equal({
      ...INITIAL_STATE,
      error: false,
      geocodeInProgress: true,
    });
  });

  it('should return the correct data for GEOLOCATE_USER', () => {
    const state = SearchQueryReducer(INITIAL_STATE, { type: GEOLOCATE_USER });

    expect(state).to.deep.equal({
      ...INITIAL_STATE,
      geolocationInProgress: true,
    });
  });

  it('should return the correct data for GEOCODE_FAILED with a given code', () => {
    const state = SearchQueryReducer(INITIAL_STATE, {
      type: GEOCODE_FAILED,
      code: 48673,
    });

    expect(state).to.deep.equal({
      ...INITIAL_STATE,
      geocodeError: 48673,
      geocodeInProgress: false,
      geolocationInProgress: false,
    });
  });

  it('should return the correct data for GEOCODE_FAILED with no given code', () => {
    const state = SearchQueryReducer(INITIAL_STATE, {
      type: GEOCODE_FAILED,
    });

    expect(state).to.deep.equal({
      ...INITIAL_STATE,
      geocodeError: -1,
      geocodeInProgress: false,
      geolocationInProgress: false,
    });
  });

  it('should return the correct data for GEOCODE_COMPLETE', () => {
    const state = SearchQueryReducer(INITIAL_STATE, {
      type: GEOCODE_COMPLETE,
      payload: 'test',
    });

    expect(state).to.deep.equal({
      ...INITIAL_STATE,
      geocodeResults: 'test',
      geocodeInProgress: false,
      geolocationInProgress: false,
    });
  });

  it('should return the correct data for GEOCODE_CLEAR_ERROR', () => {
    const state = SearchQueryReducer(INITIAL_STATE, {
      type: GEOCODE_CLEAR_ERROR,
    });

    expect(state).to.deep.equal({
      ...INITIAL_STATE,
      geocodeError: 0,
      geocodeInProgress: false,
      geolocationInProgress: false,
    });
  });

  it('should return the correct data for CLEAR_SEARCH_TEXT', () => {
    const state = SearchQueryReducer(INITIAL_STATE, {
      type: CLEAR_SEARCH_TEXT,
    });

    expect(state).to.deep.equal({
      ...INITIAL_STATE,
      searchString: '',
      isValid: false,
      locationChanged: true,
    });
  });

  it('should return the correct data for a RANDOM_ACTION', () => {
    const state = SearchQueryReducer(INITIAL_STATE, {
      type: 'RANDOM_ACTION',
    });

    expect(state).to.deep.equal({
      ...INITIAL_STATE,
    });
  });

  describe('isValid', () => {
    it('should be true with searchString and facilityType', () => {
      const state = SearchQueryReducer(INITIAL_STATE, {
        type: SEARCH_QUERY_UPDATED,
        payload: {
          searchString: 'test',
          facilityType: 'test',
        },
      });
      expect(state.isValid).to.eql(true);
      expect(state.locationChanged).to.eql(true);
      expect(state.facilityTypeChanged).to.eql(true);
      expect(state.serviceTypeChanged).to.eql(false);
    });

    it('should be false with only searchString', () => {
      const state = SearchQueryReducer(INITIAL_STATE, {
        type: SEARCH_QUERY_UPDATED,
        payload: {
          searchString: 'test',
        },
      });
      expect(state.isValid).to.eql(false);
      expect(state.locationChanged).to.eql(true);
      expect(state.facilityTypeChanged).to.eql(false);
      expect(state.serviceTypeChanged).to.eql(false);
    });

    it('should be false with only facilityType', () => {
      const state = SearchQueryReducer(INITIAL_STATE, {
        type: SEARCH_QUERY_UPDATED,
        payload: {
          facilityType: 'test',
        },
      });
      expect(state.isValid).to.eql(false);
      expect(state.locationChanged).to.eql(false);
      expect(state.facilityTypeChanged).to.eql(true);
      expect(state.serviceTypeChanged).to.eql(false);
    });

    it('should be false when facilityType is provider and no serviceType', () => {
      const state = SearchQueryReducer(INITIAL_STATE, {
        type: SEARCH_QUERY_UPDATED,
        payload: {
          searchString: 'test',
          facilityType: 'provider',
        },
      });
      expect(state.isValid).to.eql(false);
      expect(state.locationChanged).to.eql(true);
      expect(state.facilityTypeChanged).to.eql(true);
      expect(state.serviceTypeChanged).to.eql(false);
    });

    it('should be true with searchString, facilityType and serviceType', () => {
      const state = SearchQueryReducer(INITIAL_STATE, {
        type: SEARCH_QUERY_UPDATED,
        payload: {
          searchString: 'test',
          facilityType: 'provider',
          serviceType: 'test',
        },
      });
      expect(state.isValid).to.eql(true);
      expect(state.locationChanged).to.eql(true);
      expect(state.facilityTypeChanged).to.eql(true);
      expect(state.serviceTypeChanged).to.eql(true);
    });
  });

  it('should invalidate form when clearing search text', () => {
    const state = SearchQueryReducer(
      { ...INITIAL_STATE, searchString: 'Austin' },
      {
        type: CLEAR_SEARCH_TEXT,
      },
    );

    expect(state.isValid).to.eql(false);
    expect(state.searchString).to.eql('');
    expect(state.locationChanged).to.eql(true);
    expect(state.facilityTypeChanged).to.be.undefined;
    expect(state.serviceTypeChanged).to.be.undefined;
  });

  it('should return the correct data for GEOLOCATE_USER', () => {
    const state = SearchQueryReducer(INITIAL_STATE, {
      type: GEOLOCATE_USER,
    });

    expect(state).to.deep.equal({
      ...INITIAL_STATE,
      geolocationInProgress: true,
    });
  });
});

describe('validateForm function', () => {
  it('should return true when passed a valid state object', () => {
    const payload = {
      searchString: 'test',
      facilityType: 'test',
    };

    const result = validateForm(INITIAL_STATE, payload);
    expect(result.isValid).to.eql(true);
  });

  it('should return false when passed an invalid state object', () => {
    const payload = {
      searchString: null,
      facilityType: '',
    };

    const result = validateForm(INITIAL_STATE, payload);
    expect(result.isValid).to.eql(false);
  });

  it('should return true when location is changed', () => {
    const payload = {
      searchString: 'new string',
      facilityType: '',
    };

    const result = validateForm(INITIAL_STATE, payload);
    expect(result.locationChanged).to.eql(true);
  });

  it('should return true when facility type is changed', () => {
    const payload = {
      facilityType: 'test',
    };

    const result = validateForm(INITIAL_STATE, payload);
    expect(result.facilityTypeChanged).to.eql(true);
  });

  it('should return true when service type is changed', () => {
    const payload = {
      serviceType: 'test',
    };

    const result = validateForm(INITIAL_STATE, payload);
    expect(result.serviceTypeChanged).to.eql(true);
  });
});
