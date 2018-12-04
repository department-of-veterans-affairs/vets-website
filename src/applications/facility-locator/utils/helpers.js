/* eslint-disable arrow-body-style */
import { mapboxClient } from '../components/MapboxClient';

/**
 * Calculates the center point of a given geographic area
 * as defined by a bounding box of an upper-left and a
 * lower-right corner.
 *
 * @param {Array<Number>} bounds An array containing the corners
 * of a coordinate bounding box
 *
 * ex: [-77.955898, 38.380263, -76.955898, 39.380263]
 *     [ lonLL    , latLL    , lonUR     , latUR    ]
 *
 * @returns Object of shape { lon, lat } on valid input,
 * empty {} object otherwise
 */
// eslint-disable-next-line prettier/prettier
export const getBoxCenter = (bounds) => {
  if (bounds && bounds.length === 4) {
    const lonDiff = (bounds[2] - bounds[0]) / 2;
    const latDiff = (bounds[3] - bounds[1]) / 2;

    return { lon: bounds[0] + latDiff, lat: bounds[1] + lonDiff };
  }

  return {};
};

/**
 * Performs a reverse lookup of a geographic coordinate to
 * determine what address exists at the given location.
 *
 * @param {Number} lon Longitude coordinate
 * @param {Number} lat Latitude coordinate
 * @param {String} types A valid type-of-address string as defined by the Mapbox API:
 *   https://www.mapbox.com/api-documentation/?language=JavaScript#retrieve-places-near-a-location
 *   default => `'address,postcode'`
 *
 * @returns {String} The best approximation of the address for the coordinates
 */
/* eslint-disable prettier/prettier */
export const reverseGeocode = async (lon, lat, types = 'address,postcode') => {
  const { entity: { features: { 0: { place_name: placeName } } } } =
    await mapboxClient.geocodeReverse(
      { longitude: lon, latitude: lat },
      { types }
    );

  return placeName;
};
/* eslint-enable prettier/prettier */

/**
 * Performs a reverse lookup of a geographic coordinate to
 * determine what address exists at the given location.
 * In the case of a bounding box will perform a lookup of the
 * center point of the box.
 *
 * @param {Array<Number>} bounds A geographic bounding box definition
 * @param @param {String} types A valid type-of-address string as defined by the Mapbox API:
 *   https://www.mapbox.com/api-documentation/?language=JavaScript#retrieve-places-near-a-location
 *   default => `'address,postcode'`
 *
 * @returns {String} The best approximation of the address for the coordinates
 */
export const reverseGeocodeBox = (bounds, types = 'address,postcode') => {
  const { lon, lat } = getBoxCenter(bounds);
  return reverseGeocode(lon, lat, types);
};

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
    latitude: box1[0],
    longitude: box1[1],
  };
  const lowerRight2 = {
    latitude: box1[2],
    longitude: box1[3],
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
