import * as Sentry from '@sentry/browser';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import {
  // FETCH_REPRESENTATIVES,
  SEARCH_FAILED,
  SEARCH_COMPLETE,
} from '../../utils/actionTypes';

import RepresentativeFinderApi from '../../api/RepresentativeFinderApi';

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
  organizationFilter,
  dispatch,
) => {
  try {
    const dataList = await new RepresentativeFinderApi(
      address,
      lat,
      long,
      name,
      page,
      perPage,
      sort,
      type,
      distance,
      organizationFilter,
    ).searchByCoordinates();
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
