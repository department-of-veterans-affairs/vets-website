export const setFocus = selector => {
  const el =
    typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (el) {
    el.setAttribute('tabIndex', -1);
    el.focus();
  }
};

/* eslint-disable arrow-body-style */
/**
 * Position shape: `{latitude: {number}, longitude: {number}}`
 *
 * @param {Object} pos1
 * @param {Object} pos2
 */
export const areGeocodeEqual = (pos1, pos2) => {
  // eslint-disable-next-line prettier/prettier
  return (pos1.latitude === pos2.latitude) && (pos1.longitude === pos2.longitude);
};

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
// eslint-disable-next-line prettier/prettier
export const urlParamStringToObj = (urlParams) => {
  return urlParams.split('&').map(p => {
    const [key, value] = p.split('=');
    return { [key]: value };
  });
};

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
  /* eslint-disable prettier/prettier, no-useless-escape */
  const regex = '\/[a-z]{1,15}_[a-zA-Z0-9]{1,15}$';
  /* eslint-enable prettier/prettier, no-useless-escape */
  const unparsedString = `${urlPrefixString}${regex}`;
  const validString = urlObj.match(unparsedString);

  return validString;
};
