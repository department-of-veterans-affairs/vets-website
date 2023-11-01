import MapboxClient from '@mapbox/mapbox-sdk';
import mbxGeo from '@mapbox/mapbox-sdk/services/geocoding';
import * as Sentry from '@sentry/browser';
import { mapBoxToken } from '../utils/mapBoxToken';

const mapboxClient = new MapboxClient({
  accessToken: mapBoxToken,
});

export const fetchMapBoxBBoxCoordinates = async (query, client = null) => {
  if (!query) {
    return {
      type: 'SEARCH_FAILED',
      errorMessage: 'Empty search string. Search cancelled.',
    };
  }

  const newClient = client || mbxGeo(mapboxClient);

  return newClient
    .forwardGeocode({
      // Pulled from 'src/applications/facility-locator/constants/index.js'
      countries: ['us', 'pr', 'ph', 'gu', 'as', 'mp'],
      // Pulled from 'src/applications/facility-locator/constants/index.js'
      types: ['place', 'region', 'postcode', 'locality'],
      autocomplete: false,
      query,
    })
    .send()
    .then(response => {
      if (!response.body.features[0].bbox) {
        return {
          type: 'NO_SEARCH_RESULTS',
          errorMessage: 'No search results found.',
        };
      }
      return response.body.features[0].bbox;
    })
    .catch(error => {
      const errMessage =
        error?.request?.origin === 'https://api.mapbox.com'
          ? error.body.message
          : error;
      Sentry.withScope(scope => {
        scope.setExtra('error', errMessage);
        Sentry.captureMessage('Error fetching MapBox coordinates');
      });
      return {
        type: 'SEARCH_FAILED',
        errorMessage: `Something went wrong. ${errMessage}`,
      };
    });
};
