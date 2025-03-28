/* eslint-disable camelcase */
import { expect } from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import {
  constructBounds,
  processFeaturesBBox,
} from '../../actions/mapbox/genBBoxFromAddress';
import { BOUNDING_RADIUS, LocationType, MIN_RADIUS_EXP } from '../../constants';
import { radiusFromBoundingBox } from '../../utils/facilityDistance';
import { SEARCH_FAILED } from '../../actions/actionTypes';

const mockFeature = {
  id: 'place.3737836',
  type: 'Feature',
  place_type: ['place'],
  relevance: 1,
  properties: {
    mapbox_id: 'dXJuOm1ieHBsYzpPUWpz',
    wikidata: 'Q88',
  },
  text: 'Alexandria',
  place_name: 'Alexandria, Virginia, United States',
  bbox: [-77.185054, 38.688718, -77.037288, 38.851563],
  center: [-77.043625, 38.80463],
  geometry: {
    type: 'Point',
    coordinates: [-77.043625, 38.80463],
  },
  context: [
    {
      id: 'district.304876',
      mapbox_id: 'dXJuOm1ieHBsYzpCS2Jz',
      wikidata: 'Q88',
      text: 'Alexandria city',
    },
    {
      id: 'region.91372',
      mapbox_id: 'dXJuOm1ieHBsYzpBV1Rz',
      wikidata: 'Q1370',
      short_code: 'US-VA',
      text: 'Virginia',
    },
    {
      id: 'country.8940',
      mapbox_id: 'dXJuOm1ieHBsYzpJdXc',
      wikidata: 'Q30',
      short_code: 'us',
      text: 'United States',
    },
  ],
};

describe('constructBounds', () => {
  const baseParams = {
    longitude: -73.935242,
    latitude: 40.73061,
    facilityType: LocationType.HEALTH,
    expandedRadius: false,
    useProgressiveDisclosure: false,
  };

  it('should return correct bounding box for default case', () => {
    const result = constructBounds(baseParams);

    // Default BOUNDING_RADIUS is used
    expect(result).to.deep.equal([
      baseParams.longitude - BOUNDING_RADIUS, // longitude - BOUNDING_RADIUS
      baseParams.latitude - BOUNDING_RADIUS, // latitude - BOUNDING_RADIUS
      baseParams.longitude + BOUNDING_RADIUS, // longitude + BOUNDING_RADIUS
      baseParams.latitude + BOUNDING_RADIUS, // latitude + BOUNDING_RADIUS
    ]);
  });

  it('should return correct bounding box for cemetery facility type', () => {
    const result = constructBounds({
      ...baseParams,
      facilityType: LocationType.CEMETERY,
    });

    const expectedRadius = 133 / 69; // Convert miles to degrees
    const longitudeModifier = Math.cos((baseParams.latitude * Math.PI) / 180);
    const expectedLonRadius = 133 / Math.abs(longitudeModifier * 69);

    expect(result).to.deep.equal([
      baseParams.longitude - expectedLonRadius,
      baseParams.latitude - expectedRadius,
      baseParams.longitude + expectedLonRadius,
      baseParams.latitude + expectedRadius,
    ]);
  });

  it('should return correct bounding box for progressive disclosure', () => {
    const result = constructBounds({
      ...baseParams,
      useProgressiveDisclosure: true,
      facilityType: LocationType.HEALTH,
    });

    // MIN_RADIUS_EXP (10) is used for progressive disclosure
    const expectedRadius = MIN_RADIUS_EXP / 69; // Convert miles to degrees
    const longitudeModifier = Math.cos((baseParams.latitude * Math.PI) / 180);
    const expectedLonRadius = MIN_RADIUS_EXP / Math.abs(longitudeModifier * 69);

    expect(result).to.deep.equal([
      baseParams.longitude - expectedLonRadius,
      baseParams.latitude - expectedRadius,
      baseParams.longitude + expectedLonRadius,
      baseParams.latitude + expectedRadius,
    ]);
  });

  it('should not apply progressive disclosure for PPMS facility types', () => {
    const result = constructBounds({
      ...baseParams,
      useProgressiveDisclosure: true,
      facilityType: LocationType.CC_PROVIDER,
    });

    // Should use default BOUNDING_RADIUS since PPMS types are excluded
    expect(result).to.deep.equal([
      baseParams.longitude - BOUNDING_RADIUS,
      baseParams.latitude - BOUNDING_RADIUS,
      baseParams.longitude + BOUNDING_RADIUS,
      baseParams.latitude + BOUNDING_RADIUS,
    ]);
  });

  it('should use expanded radius when expandedRadius is true', () => {
    const result = constructBounds({
      ...baseParams,
      expandedRadius: true,
    });

    // EXPANDED_BOUNDING_RADIUS should be used
    expect(result).to.deep.equal([
      baseParams.longitude - 0.78,
      baseParams.latitude - 0.78,
      baseParams.longitude + 0.78,
      baseParams.latitude + 0.78,
    ]);
  });
});

describe('processFeaturesBBox', () => {
  const mockDispatch = sinon.spy();
  const mockQuery = {
    facilityType: LocationType.HEALTH,
    searchString: 'test location',
  };

  const mockPostcodeFeature = {
    id: 'postcode.60763884',
    type: 'Feature',
    place_type: ['postcode'],
    relevance: 1,
    properties: {
      mapbox_id: 'dXJuOm1ieHBsYzpBNTh1N0E',
    },
    text: '20007',
    place_name: 'Washington, District of Columbia 20007, United States',
    bbox: [-77.105161, 38.8992, -77.050085, 38.928003],
    center: [-77.062811, 38.905178],
    geometry: {
      type: 'Point',
      coordinates: [-77.062811, 38.905178],
    },
    context: [
      {
        id: 'place.345549036',
        mapbox_id: 'dXJuOm1ieHBsYzpGSmlvN0E',
        wikidata: 'Q61',
        text: 'Washington',
      },
      {
        id: 'region.328940',
        mapbox_id: 'dXJuOm1ieHBsYzpCUVRz',
        wikidata: 'Q3551781',
        short_code: 'US-DC',
        text: 'District of Columbia',
      },
      {
        id: 'country.8940',
        mapbox_id: 'dXJuOm1ieHBsYzpJdXc',
        wikidata: 'Q30',
        short_code: 'us',
        text: 'United States',
      },
    ],
  };

  beforeEach(() => {
    mockDispatch.reset();
  });

  it('should process valid feature data correctly', () => {
    processFeaturesBBox(mockQuery, [mockFeature], mockDispatch, false, false);

    expect(mockDispatch.getCall(0).args[0].type).to.equal('GEOCODE_COMPLETE');
    expect(mockDispatch.getCall(0).args[0].payload).to.deep.equal([]);

    const searchQueryUpdateCall = mockDispatch.getCall(1).args[0];
    expect(searchQueryUpdateCall.type).to.equal('SEARCH_QUERY_UPDATED');
    const bounds = constructBounds({
      facilityType: mockQuery.facilityType,
      longitude: mockFeature.center[0],
      latitude: mockFeature.center[1],
      expandedRadius: false,
      useProgressiveDisclosure: false,
    });
    const [radius] = radiusFromBoundingBox([{ bbox: bounds }]);
    expect(searchQueryUpdateCall.payload.radius).to.equal(radius);
    expect(searchQueryUpdateCall.payload.context).to.equal(
      'Alexandria, Virginia, United States',
    );
    expect(searchQueryUpdateCall.payload.inProgress).to.equal(true);
    expect(searchQueryUpdateCall.payload.position).to.deep.equal({
      latitude: 38.80463,
      longitude: -77.043625,
    });
    expect(searchQueryUpdateCall.payload.searchCoords).to.deep.equal({
      lat: 38.80463,
      lng: -77.043625,
    });
    expect(searchQueryUpdateCall.payload.zoomLevel).to.equal(9);
    expect(searchQueryUpdateCall.payload.currentPage).to.equal(1);
    expect(searchQueryUpdateCall.payload.mapBoxQuery).to.deep.equal({
      placeName: 'Alexandria, Virginia, United States',
      placeType: 'place',
    });
    expect(searchQueryUpdateCall.payload.searchArea).to.equal(null);
  });

  it('should handle feature without postcode context', () => {
    const featureWithoutPostcode = {
      ...mockPostcodeFeature,
      context: [],
    };

    processFeaturesBBox(
      mockQuery,
      [featureWithoutPostcode],
      mockDispatch,
      false,
      false,
    );

    const searchQueryUpdateCall = mockDispatch.getCall(1).args[0];
    expect(searchQueryUpdateCall.payload.context).to.equal(
      'Washington, District of Columbia 20007, United States',
    );
  });

  it('should handle region type feature', () => {
    const regionFeature = {
      ...mockFeature,
      id: 'region.123',
    };

    processFeaturesBBox(mockQuery, [regionFeature], mockDispatch, false, false);

    const searchQueryUpdateCall = mockDispatch.getCall(1).args[0];
    expect(searchQueryUpdateCall.payload.zoomLevel).to.equal(7);
  });

  it('should handle invalid feature data', () => {
    const invalidFeature = {
      center: null,
      geometry: null,
      id: null,
    };

    processFeaturesBBox(
      mockQuery,
      [invalidFeature],
      mockDispatch,
      false,
      false,
    );

    expect(mockDispatch.getCall(0).args[0].type).to.equal('GEOCODE_FAILED');
    expect(mockDispatch.getCall(1).args[0].type).to.equal('SEARCH_FAILED');
    expect(mockDispatch.getCall(1).args[0].error.type).to.equal('mapBox');
  });

  it('should handle empty features array', () => {
    processFeaturesBBox(mockQuery, [], mockDispatch, false, false);

    expect(mockDispatch.getCall(0).args[0].type).to.equal('GEOCODE_FAILED');
    expect(mockDispatch.getCall(1).args[0].type).to.equal('SEARCH_FAILED');
    expect(mockDispatch.getCall(1).args[0].error.type).to.equal('mapBox');
  });
});

describe('genBBoxFromAddress', () => {
  const mockDispatch = sinon.spy();
  const mockQuery = {
    searchString: 'Alexandria, VA',
    facilityType: LocationType.HEALTH,
  };
  const { genBBoxFromAddress: genBBoxFromAddressWithSuccess } = proxyquire(
    '../../actions/mapbox/genBBoxFromAddress',
    {
      '@mapbox/mapbox-sdk/services/geocoding': sinon.stub().returns({
        forwardGeocode: sinon.stub().returns({
          send: sinon.stub().resolves({
            body: {
              features: [mockFeature],
            },
          }),
        }),
      }),
    },
  );
  const { genBBoxFromAddress: genBBoxFromAddressWithFailure } = proxyquire(
    '../../actions/mapbox/genBBoxFromAddress',
    {
      '@mapbox/mapbox-sdk/services/geocoding': sinon.stub().returns({
        forwardGeocode: sinon.stub().returns({
          send: sinon.stub().rejects({}),
        }),
      }),
    },
  );
  beforeEach(() => {
    mockDispatch.reset();
  });

  it('should handle empty search string', () => {
    const result = genBBoxFromAddressWithFailure({ searchString: '' });
    expect(result).to.deep.equal({
      type: SEARCH_FAILED,
      error: 'Empty search string/address. Search cancelled.',
    });
  });

  it('should make real API call and process results', async () => {
    const thunk = genBBoxFromAddressWithSuccess(mockQuery);
    await thunk(mockDispatch);

    // Verify initial dispatch
    expect(mockDispatch.getCall(0).args[0].type).to.equal('GEOCODE_STARTED');

    // Wait for the API call to complete and verify the results
    // We expect at least 2 dispatches: GEOCODE_STARTED and either GEOCODE_COMPLETE or GEOCODE_FAILED
    expect(mockDispatch.callCount).to.be.at.least(3);
    const callTwo = mockDispatch.getCall(1).args[0];
    expect(callTwo.type).to.equal('GEOCODE_COMPLETE');

    if (callTwo.type === 'GEOCODE_COMPLETE') {
      // If successful, verify SEARCH_QUERY_UPDATED was dispatched
      const searchQueryUpdate = mockDispatch.getCall(2).args[0];
      expect(searchQueryUpdate.type).to.equal('SEARCH_QUERY_UPDATED');
      // Have to verify individually because the sinon match and deep equal don't work on nested arrays of objects
      expect(searchQueryUpdate.payload.context).to.equal(
        mockFeature.place_name,
      );
      expect(searchQueryUpdate.payload.inProgress).to.equal(true);
      expect(searchQueryUpdate.payload.position).to.deep.equal({
        latitude: mockFeature.center[1],
        longitude: mockFeature.center[0],
      });
      expect(searchQueryUpdate.payload.searchCoords).to.deep.equal({
        lat: mockFeature.center[1],
        lng: mockFeature.center[0],
      });
      expect(searchQueryUpdate.payload.zoomLevel).to.equal(9);
      expect(searchQueryUpdate.payload.currentPage).to.equal(1);
      expect(searchQueryUpdate.payload.mapBoxQuery).to.deep.equal({
        placeName: mockFeature.place_name,
        placeType: mockFeature.place_type[0],
      });
    }
  });
});
