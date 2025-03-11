import { expect } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

describe('Mapbox Utils', () => {
  let sandbox;
  let geocodingService;
  let mapboxUtils;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    // Create mock response data
    const mockFeature = {
      placeName: 'Test Location',
      context: [
        { id: 'postcode.123', text: '12345' },
        { id: 'place.456', text: 'City' },
      ],
      center: [-77.0366, 38.8951],
      /* eslint-disable camelcase */
      place_name: 'Test Location',
      /* eslint-enable camelcase */
    };

    // Create stubs for the Mapbox SDK methods
    geocodingService = {
      reverseGeocode: sinon.stub().returns({
        send: sinon.stub().resolves({
          body: { features: [mockFeature] },
        }),
      }),
      forwardGeocode: sinon.stub().returns({
        send: sinon.stub().resolves({
          body: { features: [mockFeature] },
        }),
      }),
    };

    // Mock the dependencies
    mapboxUtils = proxyquire('../../utils/mapbox', {
      '@mapbox/mapbox-sdk': function() {
        return {};
      },
      '@mapbox/mapbox-sdk/services/geocoding': function() {
        return geocodingService;
      },
      './mapboxToken': {
        mapboxToken: 'test-token',
      },
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('Constants', () => {
    it('should have correct countries list', () => {
      expect(mapboxUtils.CountriesList).to.deep.equal([
        'us',
        'pr',
        'ph',
        'gu',
        'as',
        'mp',
      ]);
    });

    it('should have correct types', () => {
      expect(mapboxUtils.types).to.deep.equal([
        'place',
        'region',
        'postcode',
        'locality',
      ]);
    });

    it('should have correct max search area', () => {
      expect(mapboxUtils.MAX_SEARCH_AREA).to.equal(500);
    });
  });

  describe('convertLocation', () => {
    it('should convert coordinates to location details', async () => {
      const query = [-77.0366, 38.8951];
      const result = await mapboxUtils.convertLocation(query);

      expect(result).to.deep.equal({
        /* eslint-disable camelcase */
        place_name: 'Test Location',
        /* eslint-enable camelcase */
        zipCode: [{ id: 'postcode.123', text: '12345' }],
      });
    });
  });

  describe('convertToLatLng', () => {
    it('should convert address to coordinates', async () => {
      const query = '20001';
      const result = await mapboxUtils.convertToLatLng(query);

      expect(result).to.deep.equal([-77.0366, 38.8951]);
    });
  });
});
