import { expect } from 'chai';
import sinon from 'sinon-v20';
import omit from 'lodash/omit';
import {
  GEOCODE_CLEAR_ERROR,
  GEOCODE_COMPLETE,
  GEOCODE_FAILED,
  GEOCODE_STARTED,
  MAP_MOVED,
  MOBILE_MAP_PIN_SELECTED,
  SEARCH_FAILED,
  SEARCH_QUERY_UPDATED,
} from '../../actions/actionTypes';
import {
  clearGeocodeError,
  constructBounds,
  genBBoxFromAddress,
  genSearchAreaFromCenter,
  geolocateUser,
  mapMoved,
  processFeaturesBBox,
  searchCriteriaFromCoords,
  selectMobileMapPin,
  sendUpdatedSearchQuery,
} from '../../actions/mapbox';
import { LocationType } from '../../constants';

describe('actions: mapbox', () => {
  const dispatchSpy = sinon.spy();

  afterEach(() => {
    sinon.restore();
    dispatchSpy.resetHistory();
  });

  describe('constructBounds', () => {
    it('should return the correct bounds for a CC provider', () => {
      const result = constructBounds({
        facilityType: LocationType.CC_PROVIDER,
        longitude: -98.498222,
        latitude: 29.6180888,
        expandedRadius: false,
        useProgressiveDisclosure: false,
      });

      expect(result).to.deep.equal([
        -98.878222,
        29.2380888,
        -98.118222,
        29.998088799999998,
      ]);
    });

    it('should return the correct bounds for a cemetery with expanded radius', () => {
      const result = constructBounds({
        facilityType: LocationType.CEMETERY,
        longitude: -98.498222,
        latitude: 29.6180888,
        expandedRadius: true,
        useProgressiveDisclosure: false,
      });

      expect(result).to.deep.equal([
        -100.71546562481335,
        27.69055256811594,
        -96.28097837518665,
        31.545625031884057,
      ]);
    });

    it('should return the correct bounds for a VA health facility with progressive disclosure', () => {
      const result = constructBounds({
        facilityType: LocationType.HEALTH,
        longitude: -98.498222,
        latitude: 29.6180888,
        expandedRadius: false,
        useProgressiveDisclosure: true,
      });

      expect(result).to.deep.equal([
        -99.31510123019439,
        28.90794387246377,
        -97.68134276980561,
        30.32823372753623,
      ]);
    });
  });

  describe('processFeaturesBBox', () => {
    const longitude = -98.495114;
    const latitude = 29.6267;

    describe('when one of the feature data is missing', () => {
      it('should dispatch the correct actions', () => {
        processFeaturesBBox(
          {
            facilityType: LocationType.HEALTH,
          },
          [
            {
              center: null,
              geometry: {
                coordinates: [latitude, longitude],
                type: 'Point',
              },
              id: 'postcode.270749420',
            },
          ],
          dispatchSpy,
          false,
          false,
        );

        expect(dispatchSpy.firstCall.args[0].type).to.deep.equal(
          GEOCODE_FAILED,
        );

        expect(dispatchSpy.secondCall.args[0]).to.deep.equal({
          type: SEARCH_FAILED,
          error: { type: 'mapBox' },
        });
      });
    });

    describe('when the feature data is missing completely', () => {
      it('should dispatch the correct actions', () => {
        processFeaturesBBox(
          {
            facilityType: LocationType.HEALTH,
          },
          [],
          dispatchSpy,
          false,
          false,
        );

        expect(dispatchSpy.firstCall.args[0].type).to.deep.equal(
          GEOCODE_FAILED,
        );

        expect(dispatchSpy.secondCall.args[0]).to.deep.equal({
          type: SEARCH_FAILED,
          error: { type: 'mapBox' },
        });
      });
    });

    describe('when the context is not a postcode', () => {
      it('should dispatch the correct actions', () => {
        processFeaturesBBox(
          {
            facilityType: LocationType.HEALTH,
          },
          [
            {
              center: null,
              geometry: {
                coordinates: [latitude, longitude],
                type: 'Point',
              },
              context: [
                {
                  id: 'place.291252460',
                  text: 'San Antonio',
                },
              ],
              id: 'place.270749420',
              // eslint-disable-next-line camelcase
              place_name: 'Long Island, NY',
            },
          ],
          dispatchSpy,
          false,
          false,
        );

        expect(dispatchSpy.firstCall.args[0].type).to.deep.equal(
          GEOCODE_FAILED,
        );

        expect(dispatchSpy.secondCall.args[0]).to.deep.equal({
          type: SEARCH_FAILED,
          error: { type: 'mapBox' },
        });
      });
    });

    describe('when all the data is present', () => {
      it('should dispatch the correct actions', () => {
        processFeaturesBBox(
          {
            facilityType: LocationType.HEALTH,
          },
          [
            {
              center: [longitude, latitude],
              context: [
                {
                  id: 'postcode.291252460',
                  text: 'San Antonio',
                },
              ],
              geometry: {
                coordinates: [longitude, latitude],
                type: 'Point',
              },
              id: 'postcode.270749420',
            },
          ],
          dispatchSpy,
          false,
          false,
        );

        expect(dispatchSpy.firstCall.args[0]).to.deep.equal({
          type: GEOCODE_COMPLETE,
          payload: [],
        });

        expect(dispatchSpy.secondCall.args[0].type).to.eq(SEARCH_QUERY_UPDATED);
        expect(
          omit(dispatchSpy.secondCall.args[0].payload, 'id'),
        ).to.deep.equal({
          bounds: [-98.875114, 29.2467, -98.115114, 30.0067],
          context: 'San Antonio',
          currentPage: 1,
          facilityType: LocationType.HEALTH,
          inProgress: true,
          mapBoxQuery: {
            placeName: undefined,
            placeType: undefined,
          },
          position: {
            latitude,
            longitude,
          },
          radius: 69.58070354658854,
          searchArea: null,
          searchCoords: {
            lat: latitude,
            lng: longitude,
          },
          zoomLevel: 9,
        });
      });

      it('should dispatch the correct actions', () => {
        processFeaturesBBox(
          {
            facilityType: LocationType.HEALTH,
          },
          [
            {
              center: [longitude, latitude],
              context: [
                {
                  id: 'place.291252460',
                  text: 'San Antonio',
                },
              ],
              geometry: {
                coordinates: [longitude, latitude],
                type: 'Point',
              },
              id: 'region.270749420',
            },
          ],
          dispatchSpy,
          false,
          false,
        );

        expect(dispatchSpy.firstCall.args[0]).to.deep.equal({
          type: GEOCODE_COMPLETE,
          payload: [],
        });

        expect(dispatchSpy.secondCall.args[0].type).to.eq(SEARCH_QUERY_UPDATED);
        expect(
          omit(dispatchSpy.secondCall.args[0].payload, 'id'),
        ).to.deep.equal({
          bounds: [-98.875114, 29.2467, -98.115114, 30.0067],
          context: undefined,
          currentPage: 1,
          facilityType: LocationType.HEALTH,
          inProgress: true,
          mapBoxQuery: {
            placeName: undefined,
            placeType: undefined,
          },
          position: {
            latitude,
            longitude,
          },
          radius: 69.58070354658854,
          searchArea: null,
          searchCoords: {
            lat: latitude,
            lng: longitude,
          },
          zoomLevel: 7,
        });
      });
    });
  });

  describe('genBBoxFromAddress', () => {
    it('should start the geocode if a search string is given', () => {
      const query = {
        searchString: 'San Antonio',
      };

      genBBoxFromAddress(query)(dispatchSpy);

      expect(dispatchSpy.firstCall.args[0].type).to.deep.equal(GEOCODE_STARTED);
    });

    it('should fail if no query searchString', () => {
      const query = {
        searchString: null,
      };

      const action = genBBoxFromAddress(query, null);

      expect(action).to.eql({
        type: SEARCH_FAILED,
        error: 'Empty search string/address. Search cancelled.',
      });
    });
  });

  describe('clearGeocodeError', () => {
    it('should have correct dispatch type', () => {
      return clearGeocodeError()(dispatchSpy).then(() => {
        expect(dispatchSpy.firstCall.args[0].type).to.deep.equal(
          GEOCODE_CLEAR_ERROR,
        );
      });
    });
  });

  describe('sendUpdatedSearchQuery', () => {
    const longitude = -98.495114;
    const latitude = 29.6267;

    it('should return the correct action object with diagonal radius for full bbox coverage', () => {
      sendUpdatedSearchQuery(
        dispatchSpy,
        [
          {
            center: [longitude, latitude],
            context: [
              {
                id: 'postcode.287393',
                text: 'San Antonio',
              },
            ],
            geometry: {
              coordinates: [longitude, latitude],
              type: 'Point',
            },
            id: 'postcode.287393',
            // eslint-disable-next-line camelcase
            place_name: 'San Antonio, TX',
            // eslint-disable-next-line camelcase
            place_type: ['postcode'],
          },
        ],
        latitude,
        longitude,
        [-98.875114, 29.2467, -98.115114, 30.0067],
      );

      expect(dispatchSpy.firstCall.args[0].type).to.eq(SEARCH_QUERY_UPDATED);
      expect(dispatchSpy.firstCall.args[0].payload).to.deep.equal({
        // Radius is now calculated as diagonal distance to SW corner (issue #21812 fix)
        // This ensures circular search area encompasses entire rectangular map bounds
        radius: 34.818705884707484,
        searchString: 'San Antonio',
        context: 'San Antonio',
        searchArea: {
          locationString: 'San Antonio',
          locationCoords: {
            lng: longitude,
            lat: latitude,
          },
        },
        mapBoxQuery: {
          placeName: 'San Antonio, TX',
          placeType: 'postcode',
        },
        searchCoords: null,
        bounds: [-98.875114, 29.2467, -98.115114, 30.0067],
        position: {
          latitude,
          longitude,
        },
      });
    });

    it('should return the correct action object with diagonal radius when no postcode context', () => {
      sendUpdatedSearchQuery(
        dispatchSpy,
        [
          {
            center: [longitude, latitude],
            context: [
              {
                id: 'region.287393',
                text: 'San Antonio',
              },
            ],
            geometry: {
              coordinates: [longitude, latitude],
              type: 'Point',
            },
            id: 'region.287393',
            // eslint-disable-next-line camelcase
            place_type: ['region'],
          },
        ],
        latitude,
        longitude,
        [-98.875114, 29.2467, -98.115114, 30.0067],
      );

      expect(dispatchSpy.firstCall.args[0].type).to.eq(SEARCH_QUERY_UPDATED);
      expect(dispatchSpy.firstCall.args[0].payload).to.deep.equal({
        // Radius is now calculated as diagonal distance to SW corner (issue #21812 fix)
        radius: 34.818705884707484,
        searchString: undefined,
        context: undefined,
        searchArea: {
          locationString: undefined,
          locationCoords: {
            lng: longitude,
            lat: latitude,
          },
        },
        mapBoxQuery: {
          placeName: undefined,
          placeType: 'region',
        },
        searchCoords: null,
        bounds: [-98.875114, 29.2467, -98.115114, 30.0067],
        position: {
          latitude,
          longitude,
        },
      });
    });

    it('should calculate radius that covers entire bounding box (issue #21812)', () => {
      // Test case based on the reported issue with Green Bay, WI searches
      // Ensures that the circular search radius encompasses the full rectangular map bounds
      const testLng = -87.9;
      const testLat = 44.5;
      const testBounds = [-88.5, 44.0, -87.3, 45.0]; // [minLng, minLat, maxLng, maxLat]

      sendUpdatedSearchQuery(
        dispatchSpy,
        [
          {
            center: [testLng, testLat],
            context: [
              {
                id: 'postcode.123',
                text: 'Green Bay',
              },
            ],
            geometry: {
              coordinates: [testLng, testLat],
              type: 'Point',
            },
            id: 'postcode.123',
            // eslint-disable-next-line camelcase
            place_name: 'Green Bay, WI',
            // eslint-disable-next-line camelcase
            place_type: ['postcode'],
          },
        ],
        testLat,
        testLng,
        testBounds,
      );

      const { payload } = dispatchSpy.firstCall.args[0];

      // Verify radius is calculated to SW corner, not just western edge
      // This ensures all four corners of the bounding box are within the search radius
      expect(payload.radius).to.be.a('number');
      expect(payload.radius).to.be.greaterThan(35); // Should be much larger than edge distance
    });
  });

  describe('genSearchAreaFromCenter', () => {
    describe('when the currentMapBoundsDistance is above 500', () => {
      it('should return the correct action object', () => {
        genSearchAreaFromCenter({
          lat: 29.6180888,
          lng: -98.498222,
          currentMapBoundsDistance: 600,
          currentBounds: [
            -98.878222,
            29.2380888,
            -98.118222,
            29.998088799999998,
          ],
        })(dispatchSpy);

        expect(dispatchSpy.firstCall.args[0].type).to.eq(GEOCODE_FAILED);
        expect(dispatchSpy.secondCall.args[0]).to.deep.equal({
          type: SEARCH_FAILED,
          error: { type: 'mapBox' },
        });
      });
    });
  });

  describe('searchCriteriaFromCoords', () => {
    it('should return the correct search criteria', async () => {
      const longitude = -98.498222;
      const latitude = 29.6180888;

      const response = {
        body: {
          features: [
            {
              center: [longitude, latitude],
              // eslint-disable-next-line camelcase
              place_name: 'San Francisco, CA',
            },
          ],
        },
      };

      const expectedResult = {
        bounds: [-98.878222, 29.2380888, -98.118222, 29.998088799999998],
        searchString: 'San Francisco, CA',
        position: { longitude, latitude },
      };

      const result = searchCriteriaFromCoords(response, longitude, latitude);

      expect(result).to.deep.equal(expectedResult);
    });
  });

  describe('geolocateUser', () => {
    describe(`when the user's location is not defined`, () => {
      it('should dispatch the correct action objects', async () => {
        await geolocateUser()(dispatchSpy);

        expect(dispatchSpy.firstCall.args[0].type).to.deep.equal(
          GEOCODE_FAILED,
        );
      });
    });
  });

  describe('mapMoved', () => {
    it('should return the correct action object when location is given', () => {
      const action = mapMoved(100);

      expect(action).to.eql({
        type: MAP_MOVED,
        currentRadius: 100,
      });
    });
  });

  describe('selectMobileMapPin', () => {
    it('should return the correct action object when location is given', () => {
      const data = { test: 'test' };
      const action = selectMobileMapPin(data);

      expect(action).to.eql({
        type: MOBILE_MAP_PIN_SELECTED,
        payload: data,
      });
    });
  });
});
