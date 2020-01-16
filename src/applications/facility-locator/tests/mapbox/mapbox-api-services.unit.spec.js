// Node modules.
import { expect } from 'chai';
import MapboxClient from '@mapbox/mapbox-sdk';
import mbxGeo from '@mapbox/mapbox-sdk/services/geocoding';
// Relative imports.
import { BOUNDING_RADIUS } from '../../constants';
import { mapboxToken } from '../../utils/mapboxToken';

const mapboxClient = MapboxClient({ accessToken: mapboxToken });
const mbxClient = mbxGeo(mapboxClient);

describe('Locator MapBox SDK services tests', () => {
  describe('Test the generation of bounding box from a lat/long geocoordinate and updates for placeName and zipcode', async () => {
    const {
      body: { features },
    } = await mbxClient
      .reverseGeocode({
        query: [-77.036575, 38.897663],
        types: ['address'],
      })
      .send();
    const coordinates = features[0].center;
    const placeName = features[0].place_name;
    const zipCode =
      features[0].context.find(v => v.id.includes('postcode')).text || '';

    const SearchQuery = {
      bounds: features[0].bbox || [
        coordinates[0] - BOUNDING_RADIUS,
        coordinates[1] - BOUNDING_RADIUS,
        coordinates[0] + BOUNDING_RADIUS,
        coordinates[1] + BOUNDING_RADIUS,
      ],
      searchString: placeName,
      context: zipCode,
    };

    expect(SearchQuery.bounds).to.eql([
      -77.786547,
      38.1476751,
      -76.286547,
      39.6476751,
    ]);
    expect(SearchQuery.searchString).to.eql(
      '1600 Pennsylvania Avenue Northwest, Washington, District of Columbia 20006, United States',
    );
    expect(SearchQuery.context).to.eql(20006);
  });
});
