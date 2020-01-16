// Dependencies
import moment from 'moment';
import { first, includes, last, replace, split, toLower } from 'lodash';

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
  const validString = urlObj.match(unparsedString);

  return validString;
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
  const sanitizedOperatingHours = replace(operatingHours, ' ', '');

  // Escape early if it is 'Sunrise - Sunset'.
  if (toLower(sanitizedOperatingHours) === 'sunrise-sunset') {
    return 'All Day';
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
  let formattedOpeningHour = moment(openingHour, 'hmmA').format('h:mma');
  let formattedClosingHour = moment(closingHour, 'hmmA').format('h:mma');

  // Attempt to format the hours based on 'h:mmA' if theere's a colon.
  if (includes(openingHour, ':')) {
    formattedOpeningHour = moment(openingHour, 'h:mmA').format('h:mma');
  }
  if (includes(closingHour, ':')) {
    formattedClosingHour = moment(closingHour, 'h:mmA').format('h:mma');
  }

  // Derive the formatted operating hours.
  const formattedOperatingHours = `${formattedOpeningHour} - ${formattedClosingHour}`;

  // Return original string if invalid date.
  if (formattedOperatingHours.search(/Invalid date/i) === 0) {
    return operatingHours;
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
