import * as Sentry from '@sentry/browser';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import {
  // FETCH_REPRESENTATIVES,
  SEARCH_FAILED,
  SEARCH_COMPLETE,
} from '../../utils/actionTypes';

import RepresentativeFinderApi from '../../api/RepresentativeFinderApi';
/**
 * Handles the API call to get the type of locations closest to `address`
 * and/or within the given `bounds`.
 *
 * @param {string=} address Address of the center-point of the search area
 * @param {number[]} bounds Geo-coords of the bounding box of the search area
 * @param {string} representativeType (see config.js for valid types)
 * @param {number} page What page of results to request
 * @param {Function} dispatch Redux's dispatch method
 * @param {number} api version number
 */
export const fetchRepresentatives = async (
  address,
  lat,
  long,
  name,
  page,
  perPage,
  sort,
  type,
  distance,
  dispatch,
) => {
  try {
    const dataList = await RepresentativeFinderApi.searchByCoordinates(
      address,
      lat,
      long,
      name,
      page,
      perPage,
      sort,
      type,
      distance,
    );
    if (dataList.data) {
      dispatch({ type: SEARCH_COMPLETE, payload: dataList });

      recordEvent({
        // prettier-ignore
        'event': 'far-search-results',
        'search-query': address,
        'search-filters-list': {
          'representative-type': type,
          'search-radius': distance,
          'representative-name': name,
        },
        'search-selection': 'Find VA Accredited Rep',
        'search-results-total-count': dataList?.meta?.pagination?.totalEntries,
        'search-results-total-pages': dataList?.meta?.pagination?.totalPages,
      });
    }

    if (dataList.errors?.length > 0) {
      dispatch({ type: SEARCH_FAILED, error: dataList.errors });
    }
  } catch (error) {
    Sentry.withScope(scope => {
      scope.setExtra('error', error);
      Sentry.captureMessage('Error fetching accredited representatives');
    });

    dispatch({ type: SEARCH_FAILED, error: error.message });
    throw error;
  }
};
