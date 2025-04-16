import mbxGeo from '@mapbox/mapbox-sdk/services/geocoding';
import mapboxClient from '../utils/mapbox/mapboxClient';
import { replaceStrValues } from '../utils/helpers';
import content from '../locales/en/content.json';

/* NOTE: 'ph' is intentionally excluded because caregiver support
 * services are only available in the U.S. and its territories.
 */
const MAPBOX_QUERY_COUNTRIES = ['us', 'pr', 'gu', 'as', 'mp', 'vi'];
const MAPBOX_QUERY_TYPES = [
  'place',
  'region',
  'postcode',
  'locality',
  'country',
  'neighborhood',
];

export const fetchMapBoxGeocoding = async (
  query,
  client = mbxGeo(mapboxClient),
) => {
  if (!query) {
    return {
      type: 'SEARCH_FAILED',
      errorMessage: content['error--facility-search-cancelled'],
    };
  }

  try {
    const response = await client
      .forwardGeocode({
        countries: MAPBOX_QUERY_COUNTRIES,
        types: MAPBOX_QUERY_TYPES,
        autocomplete: false,
        query,
      })
      .send();
    const features = response.body?.features || [];

    if (!features.length) {
      return {
        type: 'NO_SEARCH_RESULTS',
        errorMessage: content['error--no-results-found'],
      };
    }

    return features[0];
  } catch (error) {
    const errMessage =
      error.request?.origin === 'https://api.mapbox.com'
        ? error.body.message
        : error;

    const message = 'Error fetching Mapbox coordinates';
    window.DD_LOGS?.logger.error(message, {}, error);

    return {
      type: 'SEARCH_FAILED',
      errorMessage: replaceStrValues(
        content['error--facility-search-failed'],
        errMessage,
      ),
    };
  }
};
