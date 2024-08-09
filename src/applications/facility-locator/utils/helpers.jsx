import moment from 'moment';
import { first, includes, last, split, toLower } from 'lodash';
import { recordMarkerEvents } from './analytics';

// https://stackoverflow.com/a/50171440/1000622
export const setFocus = (selector, tabIndexInclude = true) => {
  const el =
    typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (el) {
    if (tabIndexInclude) el.setAttribute('tabIndex', -1);
    el.focus();
  }
};

export const clearLocationMarkers = () => {
  const locationMarkers = window.document.getElementsByClassName(
    'mapboxgl-marker',
  );
  Array.from(locationMarkers).forEach(marker =>
    marker.parentNode.removeChild(marker),
  );
};

export const buildMarker = (type, values) => {
  if (type === 'location') {
    const { loc, attrs } = values;
    const markerElement = document.createElement('span');
    markerElement.className = 'i-pin-card-map';
    markerElement.style.cursor = 'pointer';
    markerElement.textContent = attrs.letter;
    markerElement.addEventListener('click', function() {
      const locationElement = document.getElementById(loc.id);
      if (locationElement) {
        Array.from(document.getElementsByClassName('facility-result')).forEach(
          e => {
            e.classList.remove('active');
          },
        );
        locationElement.classList.add('active');
        recordMarkerEvents(loc);
        document.getElementById('searchResultsContainer').scrollTop =
          locationElement.offsetTop;
      }
    });
    return markerElement;
  }

  if (type === 'currentPos') {
    const markerElement = document.createElement('div');
    markerElement.className = 'current-pos-pin';
    return markerElement;
  }
  return null;
};

export const resetMapElements = () => {
  clearLocationMarkers();
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
  // Remove all whitespace and sanitize dashes.
  const sanitizedOperatingHours = operatingHours
    .replace(/ /g, '')
    .replace(/[–—]/g, '-'); // Replace en and em dashes with hyphens.

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

  // If there are multiple time ranges, such as for lunch hours, return original hours
  if (hours.length >= 3) {
    return operatingHours;
  }

  // Format the hours based on 'hmmA' format.
  const openingHour = first(hours);
  const closingHour = last(hours);
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
