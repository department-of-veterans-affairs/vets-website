import recordEvent from 'platform/monitoring/record-event';
// import { distBetween } from './representativeDistance';

/**
 * Helper fn to record click result data layer
 */
export const recordResultClickEvents = (location, index) => {
  const { classification, name, facilityType, id } = location.attributes;
  const { currentPage } = location;

  if (classification && name && facilityType && id) {
    recordEvent({
      event: 'fl-results-click',
      'fl-result-page-number': currentPage,
      'fl-result-position': index + 1,
      'fl-facility-type': facilityType,
      'fl-facility-classification': classification,
      'fl-facility-name': name,
      'fl-facility-id': id,
    });
  }
};

/**
 * Helper fn to record search results (mapbox and api response) data layer
 */
export const recordSearchResultsEvents = (props, results) => {
  const dataPush = { event: 'fl-search-results' };
  const { currentQuery, pagination, resultTime } = props;

  if (currentQuery) {
    dataPush['fl-facility-type-filter'] = currentQuery.facilityType;

    if (currentQuery.serviceType) {
      dataPush['fl-service-type-filter'] = currentQuery.serviceType;
    }

    if (currentQuery.locationInputString) {
      dataPush['fl-searched-query'] = currentQuery.locationInputString;
    }

    if (currentQuery.mapBoxQuery) {
      dataPush['fl-mapbox-returned-place-type'] =
        currentQuery.mapBoxQuery.placeType;
      dataPush['fl-mapbox-returned-place-name'] =
        currentQuery.mapBoxQuery.placeName;
    }
  }

  if (results) {
    dataPush['fl-results-returned'] = !!results.length;
    dataPush['fl-total-number-of-results'] = results.length;
    dataPush['fl-closest-result-distance-miles'] = results[0].distance;
  }

  if (pagination && pagination.totalPages) {
    dataPush['fl-total-number-of-result-pages'] = pagination.totalPages;
  }

  if (resultTime) {
    dataPush['fl-time-to-return-results'] = resultTime;
  }

  recordEvent(dataPush);
};
