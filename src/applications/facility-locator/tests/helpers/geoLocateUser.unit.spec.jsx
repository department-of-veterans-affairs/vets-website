import { expect } from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import {
  GEOLOCATE_USER,
  GEOCODE_FAILED,
  GEOCODE_COMPLETE,
  SEARCH_QUERY_UPDATED,
} from '../../actions/actionTypes';

describe('geoLocateUser', () => {
  let dispatch;
  let mockGeolocation;
  let mockPosition;

  const mockMbxClient = {
    reverseGeocode: sinon.stub().returns({
      send: sinon.stub(),
    }),
  };
  const searchCriteraFromCoords = sinon.stub();

  const { geolocateUser } = proxyquire('../../actions/mapbox/geoLocateUser', {
    '../../utils/mapHelpers': {
      searchCriteraFromCoords,
    },
    '@mapbox/mapbox-sdk/services/geocoding': () => mockMbxClient,
  });

  beforeEach(() => {
    dispatch = sinon.spy();
    mockPosition = {
      coords: {
        latitude: 40.7128,
        longitude: -74.006,
      },
    };
    mockGeolocation = {
      getCurrentPosition: sinon.stub(),
    };
    global.navigator = {
      geolocation: mockGeolocation,
    };
  });

  afterEach(() => {
    dispatch.reset();
    delete global.navigator;
  });

  it('should handle successful geolocation', async () => {
    const mockQuery = { lat: 40.7128, lng: -74.006 };

    mockGeolocation.getCurrentPosition.callsArgWith(0, mockPosition);

    searchCriteraFromCoords.resolves(mockQuery);

    await geolocateUser()(dispatch);

    expect(dispatch.getCall(0).args[0].type).to.equal(GEOLOCATE_USER);
    expect(dispatch.getCall(1).args[0].type).to.equal(GEOCODE_COMPLETE);
    expect(dispatch.getCall(2).args[0].type).to.equal(SEARCH_QUERY_UPDATED);
    expect(dispatch.getCall(2).args[0].payload).to.deep.equal(mockQuery);
  });

  it('should handle geolocation error', async () => {
    const error = { code: 1 };
    mockGeolocation.getCurrentPosition.callsArgWith(1, error);

    await geolocateUser()(dispatch);

    expect(dispatch.getCall(0).args[0].type).to.equal(GEOLOCATE_USER);
    expect(dispatch.getCall(1).args[0].type).to.equal(GEOCODE_FAILED);
    expect(dispatch.getCall(1).args[0].code).to.equal(1);
  });

  it('should handle browser not supporting geolocation', async () => {
    delete global.navigator.geolocation;

    await geolocateUser()(dispatch);

    expect(dispatch.getCall(0).args[0].type).to.equal(GEOCODE_FAILED);
    expect(dispatch.getCall(0).args[0].code).to.equal(-1);
  });

  it('should handle geolocation timeout', async () => {
    const timeoutError = { code: 3 }; // PositionError.TIMEOUT
    mockGeolocation.getCurrentPosition.callsArgWith(1, timeoutError);

    await geolocateUser()(dispatch);

    expect(dispatch.getCall(0).args[0].type).to.equal(GEOLOCATE_USER);
    expect(dispatch.getCall(1).args[0].type).to.equal(GEOCODE_FAILED);
    expect(dispatch.getCall(1).args[0].code).to.equal(3);
  });
});
