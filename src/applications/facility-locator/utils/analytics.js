import recordEvent from 'platform/monitoring/record-event';
import { distBetween } from './facilityDistance';

/**
 * Helper fn to record Markers events for GA
 */
export const recordMarkerEvents = r => {
  const { classification, name, facilityType, id } = r.attributes;
  const distance = r.distance;

  if (classification && name && facilityType && distance && id) {
    recordEvent({
      event: 'fl-map-pin-click',
      'fl-facility-type': facilityType,
      'fl-facility-classification': classification,
      'fl-facility-name': name,
      'fl-facility-distance-from-search': distance,
      'fl-facility-id': id,
    });
  }
};

/**
 * Helper fn to record map zoom and panning events for GA
 */
export const recordZoomPanEvents = (e, searchCoords, currentZoomLevel) => {
  if (currentZoomLevel && e.zoom > currentZoomLevel) {
    recordEvent({ event: 'fl-map-zoom-in' });
  } else if (currentZoomLevel && e.zoom < currentZoomLevel) {
    recordEvent({ event: 'fl-map-zoom-out' });
  }

  if (searchCoords && searchCoords.lat && searchCoords.lng) {
    const distanceMoved = distBetween(
      searchCoords.lat,
      searchCoords.lng,
      e.center[0],
      e.center[1],
    );

    if (distanceMoved > 0) {
      recordEvent({
        event: 'fl-search',
        'fl-map-miles-moved': distanceMoved,
      });
      recordEvent({
        'fl-map-miles-moved': undefined,
      });
    }
  }
};

/**
 * Helper fn to record click result data layer
 */
export const recordResultClickEvents = (location, index) => {
  const { classification, name, facilityType, id } = location.attributes;
  const currentPage = location.currentPage;

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

    if (currentQuery.searchString) {
      dataPush['fl-searched-query'] = currentQuery.searchString;
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

/**
 * Helper fn to record map zoom
 */
export const recordZoomEvent = (lastZoom, currentZoom) => {
  if (lastZoom === currentZoom) return;
  if (lastZoom < currentZoom) {
    recordEvent({ event: 'fl-map-zoom-in' });
  } else if (lastZoom > currentZoom) {
    recordEvent({ event: 'fl-map-zoom-out' });
  }
};

/**
 * Helper fn to record map panning
 */
export const recordPanEvent = (mapCenter, currentQuery) => {
  const { searchCoords, searchArea } = currentQuery;
  return new Promise((resolve, _) => {
    let distanceMoved;

    if (searchCoords) {
      distanceMoved = distBetween(
        searchCoords.lat,
        searchCoords.lng,
        mapCenter.lat,
        mapCenter.lng,
      );
    } else if (distanceMoved) {
      distanceMoved = distBetween(
        searchArea.locationCoords.lat,
        searchArea.locationCoords.lng,
        mapCenter.lat,
        mapCenter.lng,
      );
    }

    if (distanceMoved > 0) {
      resolve(
        recordEvent({
          event: 'fl-search',
          'fl-map-miles-moved': distanceMoved,
        }),
        recordEvent({
          'fl-map-miles-moved': undefined,
        }),
      );
    }
  });
};
