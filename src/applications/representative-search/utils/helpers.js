// https://stackoverflow.com/a/50171440/1000622
export const setFocus = (selector, tabIndexInclude = true) => {
  const el =
    typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (el) {
    if (tabIndexInclude) el.setAttribute('tabIndex', -1);
    el.focus();
  }
};

export const appendReportsFromLocalStorage = resultsArray => {
  const localReportsArray = localStorage.getItem('vaReports');

  if (localReportsArray) {
    const parsedLocalReportsArray = JSON.parse(localReportsArray);
    for (const localReport of parsedLocalReportsArray) {
      const resultMatch = resultsArray.find(
        resultItem => resultItem.id === localReport.representativeId,
      );

      if (resultMatch) {
        resultMatch.reports = localReport.reports;
      }
    }
  }

  return resultsArray;
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

export const mockPaginatedResponse = (allResults, page) => {
  const itemsPerPage = 10;
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const data = allResults.data.slice(startIndex, endIndex);
  const link = `https://staging-api.va.gov/services/veteran/v0/vso_accredited_representatives${window.location.search.substring(
    1,
  )}`;
  const links = {
    self: link,
    first: link,
    prev: null,
    next: link,
    last: link,
  };
  const meta = {
    pagination: {
      currentPage: page,
      perPage: 10,
      totalPages: Math.ceil(allResults.data.length / 10),
      totalEntries: allResults.data.length,
    },
  };

  return { data, links, meta };
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
