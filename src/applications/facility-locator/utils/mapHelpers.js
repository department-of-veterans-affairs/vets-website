/* eslint-disable no-use-before-define */
/* eslint-disable arrow-body-style */
import { mapboxClient } from '../components/MapboxClient';

// eslint-disable-next-line spaced-comment
/******************************************************
 * Helper functions specifically requiring the
 * MapboxClient API.
 *
 * Note: Be careful when unit testing these, causes a
 * node issue when going through the import chain.
 * Likely best to try the mock API from Mapbox.
 ******************************************************/

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
