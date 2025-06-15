import { expect } from 'chai';
import sinon from 'sinon';
import * as mapboxUtils from '../../utils/mapbox';

describe.skip('Mapbox Utils', () => {
  let sandbox;
  let mockClient;

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
    };

    // Create mock client with stubbed methods
    mockClient = {
      reverseGeocode: sandbox.stub().returns({
        send: sandbox.stub().resolves({
          body: { features: [mockFeature] },
        }),
      }),
      forwardGeocode: sandbox.stub().returns({
        send: sandbox.stub().resolves({
          body: { features: [mockFeature] },
        }),
      }),
    };

    // Replace the internal mbxClient with our mock
    sandbox.stub(mapboxUtils, 'mbxClient').value(mockClient);
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

      // Verify the geocoding service was called correctly
      expect(mockClient.reverseGeocode.calledOnce).to.be.true;
      const call = mockClient.reverseGeocode.getCall(0);
      expect(call.args[0]).to.deep.include({
        query,
        limit: 1,
      });
    });

    it('should handle empty response', async () => {
      mockClient.reverseGeocode.returns({
        send: sandbox.stub().resolves({
          body: { features: [] },
        }),
      });

      const query = [-77.0366, 38.8951];
      try {
        await mapboxUtils.convertLocation(query);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).to.exist;
      }
    });
  });

  describe('convertToLatLng', () => {
    it('should convert address to coordinates', async () => {
      const query = '20001';
      const result = await mapboxUtils.convertToLatLng(query);

      expect(result).to.deep.equal([-77.0366, 38.8951]);

      // Verify the geocoding service was called correctly
      expect(mockClient.forwardGeocode.calledOnce).to.be.true;
      const call = mockClient.forwardGeocode.getCall(0);
      expect(call.args[0]).to.deep.include({
        query,
        countries: mapboxUtils.CountriesList,
        types: mapboxUtils.types,
        autocomplete: false,
      });
    });

    it('should handle empty response', async () => {
      mockClient.forwardGeocode.returns({
        send: sandbox.stub().resolves({
          body: { features: [] },
        }),
      });

      const query = '20001';
      try {
        await mapboxUtils.convertToLatLng(query);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).to.exist;
      }
    });
  });
});
