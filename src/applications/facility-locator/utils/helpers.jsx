// Dependencies
import React from 'react';
import moment from 'moment';
import { first, includes, last, split, toLower } from 'lodash';
import { CLINIC_URGENTCARE_SERVICE, LocationType } from '../constants';
import UrgentCareAlert from '../containers/UrgentCareAlert';

import recordEvent from 'platform/monitoring/record-event';
import { distBetween } from '../utils/facilityDistance';

export const setFocus = selector => {
  const el =
    typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (el) {
    el.setAttribute('tabIndex', -1);
    el.focus();
  }
};

/**
 * Position shape: `{latitude: {number}, longitude: {number}}`
 *
 * @param {Object} pos1
 * @param {Object} pos2
 */
export const areGeocodeEqual = (pos1, pos2) =>
  pos1.latitude === pos2.latitude && pos1.longitude === pos2.longitude;

/**
 * Compares two geographic bounding boxes to determine if they are equal.
 *
 * A bounding box is expected to be of the shape
 *   [lat1, long1, lat2, long2]
 *
 * @param {number[]} box1 The first bounding box's coords
 * @param {number[]} box2 The second bounding box's coords
 */
export const areBoundsEqual = (box1, box2) => {
  // Bounding boxes need 4 coordinates to be valid
  // upperLeft (lat1,long1) --> __|_____
  //                              |    |
  //                              |    |
  //                              ¯¯¯¯¯|¯¯ <-- (lat2,long2) lowerRight
  if (!box1 || !box2 || box1.length !== 4 || box2.length !== 4) {
    return false;
  }
  const upperLeft1 = {
    latitude: box1[0],
    longitude: box1[1],
  };
  const lowerRight1 = {
    latitude: box1[2],
    longitude: box1[3],
  };
  const upperLeft2 = {
    latitude: box2[0],
    longitude: box2[1],
  };
  const lowerRight2 = {
    latitude: box2[2],
    longitude: box2[3],
  };

  return (
    areGeocodeEqual(upperLeft1, upperLeft2) &&
    areGeocodeEqual(lowerRight1, lowerRight2)
  );
};

/**
 * A utility to break URL query strings up into a queriable object
 *
 * @param {string} urlParams A URL query string (e.g. key=value&key2=value2...)
 */
export const urlParamStringToObj = urlParams =>
  urlParams.split('&').map(p => {
    const [key, value] = p.split('=');
    return { [key]: value };
  });

/**
 * "Enum" of keyboard keys to their numerical equivalent
 */
export const keyMap = {
  TAB: 9,
  ENTER: 13,
  ESCAPE: 27,
  SPACE: 32,
  UP: 38,
  DOWN: 40,
};

/**
 *
 * @param {Object} urlObj Typically location.pathname
 * @param {String} urlPrefixString Types like "/facility" or "/provider"
 *
 * Matches on all of the following URL shapes.
 * The first item would not match our previous regex,
 * and the breadcrumb would not add a third link.
 *
 * find-locations/facility/nca_s1130
 * find-locations/facility/vha_691GE
 * find-locations/facility/nca_827
 */
export const validateIdString = (urlObj, urlPrefixString) => {
  const regex = '/[a-z]{1,15}_[a-zA-Z0-9]{1,15}$';
  const unparsedString = `${urlPrefixString}${regex}`;
  return urlObj.match(unparsedString);
};

/**
 *
 * @param {String} operatingHours '800AM-500PM' or 'Sunrise - Sunset', etc.
 *
 * Formats an operating hours string to be more legible.
 *
 * @returns {String} Formatted operating hours, like '8:00am - 5:00pm' or 'All Day', etc.
 *
 */
export const formatOperatingHours = operatingHours => {
  if (!operatingHours) return operatingHours;
  // Remove all whitespace.
  const sanitizedOperatingHours = operatingHours.replace(/ /g, '');

  if (sanitizedOperatingHours.search(/AM-PM/i) === 0) {
    return operatingHours;
  }

  if (
    sanitizedOperatingHours.search(/Sunrise-Sunset/i) === 0 ||
    sanitizedOperatingHours.search(/Sunrise-Sundown/i) === 0
  ) {
    return operatingHours;
  }

  if (sanitizedOperatingHours.search(/24\/7/i) === 0) {
    return sanitizedOperatingHours;
  }

  if (
    sanitizedOperatingHours.search(/ByAppointmentOnly/i) === 0 ||
    sanitizedOperatingHours.search(/AppointmentsOnly/i) === 0 ||
    sanitizedOperatingHours.search(/PleaseCallforHours/i) === 0 ||
    sanitizedOperatingHours.search(
      /3rdThursdayeverymonth,pleasecallforhours./i,
    ) === 0 ||
    sanitizedOperatingHours.search(/2ndand4thWeds.eachmonth.Callforhours./i) ===
      0 ||
    sanitizedOperatingHours.search(
      /LastMondayeverymonth,pleasecallforhours./i,
    ) === 0
  ) {
    return operatingHours;
  }

  // Derive if the hours are closed.
  const isClosed =
    sanitizedOperatingHours === '-' ||
    includes(toLower(sanitizedOperatingHours), 'close');

  // Escape early if it is '-' or 'Closed'.
  if (isClosed) {
    return 'Closed';
  }

  // Derive the opening and closing hours.
  const hours = split(sanitizedOperatingHours, '-');
  const openingHour = first(hours);
  const closingHour = last(hours);

  // Format the hours based on 'hmmA' format.
  let formattedOpeningHour = moment(openingHour, 'hmmA').format('h:mm a');
  let formattedClosingHour = moment(closingHour, 'hmmA').format('h:mm a');

  // Attempt to format the hours based on 'h:mmA' if theere's a colon.
  if (includes(openingHour, ':')) {
    formattedOpeningHour = moment(openingHour, 'h:mmA').format('h:mm a');
  }
  if (includes(closingHour, ':')) {
    formattedClosingHour = moment(closingHour, 'h:mmA').format('h:mm a');
  }
  // Return original string if invalid date.
  if (formattedOpeningHour.search(/Invalid date/i) === 0) {
    formattedOpeningHour = operatingHours;
  }

  // Return original string if invalid date.
  if (formattedClosingHour.search(/Invalid date/i) === 0) {
    formattedClosingHour = closingHour;
  }

  let formattedOperatingHours;

  // Derive the formatted operating hours.
  // TODO this will be handled by the backend later for now this should work
  if (
    (formattedOpeningHour.search(/Invalid date/i) !== 0 &&
      formattedClosingHour.search(/Invalid date/i) !== 0) ||
    (formattedOpeningHour.search(/Invalid date/i) !== 0 &&
      formattedClosingHour.search(/Invalid date/i) === 0) ||
    (formattedOpeningHour.search(/Invalid date/i) === 0 &&
      formattedClosingHour.search(/Invalid date/i) !== 0)
  ) {
    formattedOperatingHours = `${formattedOpeningHour} - ${formattedClosingHour}`;
  }

  // Return the formatted operating hours.
  return formattedOperatingHours;
};

/**
 *
 * @param {String} website for example google.com, https://va.gov/
 *
 * Uses a regular expression to find va.gov, www.va.gov or staging.va.gov in the website domain
 *
 * @returns {boolean}
 *
 */
export const isVADomain = website => {
  const regExp1 = /https?:\/\/(?:www\.|staging\.)?va\.gov(\/*)/;
  return regExp1.test(website);
};

/**
 * Helper method to display an urgent care alert dialog
 *
 * @param {object} state currentQuery
 */
export const showDialogUrgCare = currentQuery => {
  if (
    (currentQuery.facilityType === LocationType.URGENT_CARE &&
      currentQuery.serviceType === 'NonVAUrgentCare') ||
    currentQuery.facilityType === LocationType.URGENT_CARE_PHARMACIES
  ) {
    return <UrgentCareAlert />;
  }

  if (
    currentQuery.facilityType === LocationType.CC_PROVIDER &&
    currentQuery.serviceType === CLINIC_URGENTCARE_SERVICE
  ) {
    return <UrgentCareAlert />;
  }

  return null;
};

/**
 * Helper fn to record Markers events for GA
 */
export const recordMarkerEvents = r => {
  const { classification, name, facilityType } = r.attributes;
  const distance = r.distance;

  if (classification && name && facilityType && distance) {
    recordEvent({
      event: 'fl-map-pin-click',
      'fl-facility-type': facilityType,
      'fl-facility-classification': classification,
      'fl-facility-name': name,
      'fl-facility-distance-from-search': distance,
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
