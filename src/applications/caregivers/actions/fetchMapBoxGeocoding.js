import * as Sentry from '@sentry/browser';
import mbxGeo from '@mapbox/mapbox-sdk/services/geocoding';
import {
  CountriesList,
  MAPBOX_QUERY_TYPES,
} from 'platform/utilities/facilities-and-mapbox';
import mapboxClient from '../utils/mapbox/mapboxClient';
import { replaceStrValues } from '../utils/helpers';
import content from '../locales/en/content.json';

export const fetchMapBoxGeocoding = async (query, client = null) => {
  if (!query) {
    return {
      type: 'SEARCH_FAILED',
      errorMessage: content['error--facility-search-cancelled'],
    };
  }

  const fetchClient = client || mbxGeo(mapboxClient);

  return fetchClient
    .forwardGeocode({
      countries: CountriesList,
      types: MAPBOX_QUERY_TYPES,
      autocomplete: false,
      query,
    })
    .send()
    .then(({ body: response }) => {
      if (!response.features.length) {
        return {
          type: 'NO_SEARCH_RESULTS',
          errorMessage: content['error--no-results-found'],
        };
      }
      return response.features[0];
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
