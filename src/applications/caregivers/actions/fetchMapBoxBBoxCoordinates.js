import * as Sentry from '@sentry/browser';
import mbxGeo from '@mapbox/mapbox-sdk/services/geocoding';
import mapboxClient from '../utils/mapbox/mapboxClient';
import { replaceStrValues } from '../utils/helpers';
import content from '../locales/en/content.json';

export const fetchMapBoxBBoxCoordinates = async (query, client = null) => {
  if (!query) {
    return {
      type: 'SEARCH_FAILED',
      errorMessage: content['error--facility-search-cancelled'],
    };
  }

  const fetchClient = client || mbxGeo(mapboxClient);

  return fetchClient
    .forwardGeocode({
      // Pulled from 'src/applications/facility-locator/constants/index.js'
      countries: ['us', 'pr', 'ph', 'gu', 'as', 'mp'],
      // Pulled from 'src/applications/facility-locator/constants/index.js'
      types: ['place', 'region', 'postcode', 'locality'],
      autocomplete: false,
      query,
    })
    .send()
    .then(({ body: response }) => {
      if (!response.features[0].bbox) {
        return {
          type: 'NO_SEARCH_RESULTS',
          errorMessage: content['error--no-results-found'],
        };
      }
      return response.features[0].bbox;
    })
    .catch(error => {
      const errMessage =
        error?.request?.origin === 'https://api.mapbox.com'
          ? error.body.message
          : error;
      Sentry.withScope(scope => {
        scope.setExtra('error', errMessage);
        Sentry.captureMessage(content['error--fetching-coordinates']);
      });
      return {
        type: 'SEARCH_FAILED',
        errorMessage: replaceStrValues(
          content['error--facility-search-failed'],
          errMessage,
        ),
      };
    });
};
