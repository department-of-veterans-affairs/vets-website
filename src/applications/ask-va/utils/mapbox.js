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
      return feature.place_name;
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
      return features[0].center;
    });
};

export { convertLocation, convertToLatLng };
