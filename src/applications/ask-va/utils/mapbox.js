import MapboxClient from '@mapbox/mapbox-sdk';
import mbxGeo from '@mapbox/mapbox-sdk/services/geocoding';
import { mapboxToken } from './mapboxToken';

const mapboxClient = new MapboxClient({ accessToken: mapboxToken });
const mbxClient = mbxGeo(mapboxClient);

export const CountriesList = ['us', 'pr', 'ph', 'gu', 'as', 'mp'];

/**
 * Mapbox api request types
 */

export const types = ['place', 'region', 'postcode', 'locality'];

/**
 * Max search area in miles
 */

export const MAX_SEARCH_AREA = 500;

const convertLocation = async query => {
  return mbxClient
    .reverseGeocode({
      query,
      limit: 1,
    })
    .send()
    .then(res => {
      const feature = res.body.features[0];
      const zipCode = feature.context.filter(
        item => item.id.split('.')[0] === 'postcode',
      );

      return {
        /* eslint-disable camelcase */
        place_name: feature.place_name,
        zipCode,
      };
    });
};

// convert zip, city, or state to lat and long return lat and long array
const convertToLatLng = async query => {
  return mbxClient
    .forwardGeocode({
      countries: CountriesList,
      types,
      autocomplete: false, // set this to true when build the predictive search UI (feature-flipped)
      query,
    })
    .send()
    .then(({ body: { features } }) => {
      if (!features.length) {
        return [];
      }
      return features[0].center;
    });
};

export { convertLocation, convertToLatLng };
