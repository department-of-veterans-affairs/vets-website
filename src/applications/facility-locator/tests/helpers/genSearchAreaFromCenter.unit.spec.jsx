/* eslint-disable camelcase */

import proxyquire from 'proxyquire';
import sinon from 'sinon';
import { expect } from 'chai';

describe('genSearchAreaFromCenter', () => {
  const mockDistBetween = sinon.stub().returns(10); // always return 10 so no reset
  let mockDispatch;
  const mockMbxClient = {
    reverseGeocode: sinon.stub().returns({
      send: sinon.stub(),
    }),
  };
  const { genSearchAreaFromCenter } = proxyquire(
    '../../actions/mapbox/genSearchAreaFromCenter',
    {
      '@mapbox/mapbox-sdk/services/geocoding': () => mockMbxClient,
      '../../utils/facilityDistance': {
        distBetween: mockDistBetween,
      },
    },
  );

  beforeEach(() => {
    mockDispatch = sinon.spy();
  });

  afterEach(() => {
    mockDispatch.reset();
  });

  it('should dispatch GEOCODE_FAILED and SEARCH_FAILED when distance is over 500', () => {
    const query = {
      lat: 40.7128,
      lng: -74.006,
      currentMapBoundsDistance: 600,
      currentBounds: [-74.1, 40.7, -73.9, 40.8],
    };

    mockMbxClient.reverseGeocode().send.resolves({});
    genSearchAreaFromCenter(query)(mockDispatch);

    expect(mockDispatch.callCount).to.equal(2);
    expect(mockDispatch.getCall(0).args[0].type).to.eql('GEOCODE_FAILED');
    expect(mockDispatch.getCall(1).args[0].type).to.eql('SEARCH_FAILED');
    expect(mockDispatch.getCall(1).args[0].error.type).to.eql('mapBox');
  });

  it('should successfully update search query with location data', async () => {
    const query = {
      lat: 40.7128,
      lng: -74.006,
      currentMapBoundsDistance: 100,
      currentBounds: [-74.1, 40.7, -73.9, 40.8],
    };

    const mockResponse = {
      body: {
        features: [
          {
            context: [{ id: 'postcode.12345', text: '12345' }],
            place_name: 'New York, NY 12345',
            place_type: ['place'],
          },
        ],
      },
    };
    mockMbxClient.reverseGeocode().send.resolves(mockResponse);

    await genSearchAreaFromCenter(query)(mockDispatch);
    expect(mockDispatch.callCount).to.equal(1);
    expect(mockDispatch.firstCall.args[0]).to.deep.equal({
      type: 'SEARCH_QUERY_UPDATED',
      payload: {
        radius: 10,
        searchString: '12345',
        context: '12345',
        searchArea: {
          locationString: '12345',
          locationCoords: {
            lng: -74.006,
            lat: 40.7128,
          },
        },
        mapBoxQuery: {
          placeName: 'New York, NY 12345',
          placeType: 'place',
        },
        searchCoords: null,
        bounds: [-74.1, 40.7, -73.9, 40.8],
        position: {
          latitude: 40.7128,
          longitude: -74.006,
        },
      },
    });
  });

  it.skip('should handle geocoding failure', async () => {
    const query = {
      lat: 40.7128,
      lng: -74.006,
      currentMapBoundsDistance: 100,
      currentBounds: [-74.1, 40.7, -73.9, 40.8],
    };

    mockMbxClient.reverseGeocode().send.rejects();

    genSearchAreaFromCenter(query)(mockDispatch);
    // unfortunately, because of the reject and catch in the action, this version sinon
    // doesn't recognize ANY calls to mockDispatch in the catch block
  });

  it('should use placeName when postcode is not available', async () => {
    const query = {
      lat: 40.7128,
      lng: -74.006,
      currentMapBoundsDistance: 100,
      currentBounds: [-74.1, 40.7, -73.9, 40.8],
    };

    const mockResponse = {
      body: {
        features: [
          {
            context: [],
            place_name: 'New York, NY',
            place_type: ['place'],
          },
        ],
      },
    };

    mockMbxClient.reverseGeocode().send.resolves(mockResponse);

    await genSearchAreaFromCenter(query)(mockDispatch);
    expect(mockDispatch.callCount).to.equal(1);
    expect(mockDispatch.firstCall.args[0].payload.searchString).to.equal(
      'New York, NY',
    );
    expect(mockDispatch.firstCall.args[0].payload.context).to.equal(
      'New York, NY',
    );
  });
});
