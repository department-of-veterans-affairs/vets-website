import recordEvent from 'platform/monitoring/record-event';
// import { distBetween } from './representativeDistance';

/**
 * Helper fn to record search results (mapbox and api response) data layer
 */
export const recordSearchResultsEvents = (props, results) => {
  const dataPush = { event: 'far-search-results' };
  const { currentQuery, pagination, resultTime } = props;

  if (currentQuery) {
    dataPush['far-representative-type-filter'] =
      currentQuery.representativeType;

    if (currentQuery.context.location) {
      dataPush['far-searched-query-location'] = currentQuery.context.location;
    }

    if (currentQuery.context.repOrgName) {
      dataPush['far-searched-query-rep-org-name'] =
        currentQuery.context.repOrgName;
    }

    if (currentQuery.mapBoxQuery) {
      dataPush['far-mapbox-returned-place-type'] =
        currentQuery.mapBoxQuery.placeType;
      dataPush['far-mapbox-returned-place-name'] =
        currentQuery.mapBoxQuery.placeName;
    }
  }

  if (results) {
    dataPush['far-results-returned'] = !!results.length;
    dataPush['far-total-number-of-results'] = results.length;
  }

  if (pagination && pagination.totalPages) {
    dataPush['far-total-number-of-result-pages'] = pagination.totalPages;
  }

  if (resultTime) {
    dataPush['far-time-to-return-results'] = resultTime;
  }

  recordEvent(dataPush);
};
