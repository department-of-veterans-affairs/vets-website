import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';

export const recordSearchResultsChange = (
  {
    representativeType,
    distance,
    representativeName,
    resultCount,
    pageCount,
    page,
  },
  changeType,
  changeLabel = '',
) => {
  const eventParams = {
    'search-filters-list': {
      'representative-type': representativeType,
      'search-radius': distance,
      'representative-name': representativeName,
    },
    'search-results-total-count': resultCount,
    'search-results-total-pages': pageCount,
    'search-selection': 'Find VA Accredited Rep',
  };

  if (changeType === 'location') {
    recordEvent({ ...eventParams, event: 'far-search-results' });
  } else {
    recordEvent({
      ...eventParams,
      // prettier-ignore
      'event': 'far-search-results-change',
      'search-results-change-action-type': changeType,
      'search-results-change-action-label': changeLabel,
      'search-results-page': page,
    });
  }
};
