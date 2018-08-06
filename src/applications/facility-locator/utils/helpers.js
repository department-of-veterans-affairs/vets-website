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
 *   default => 'address,postcode'
 */
export const reverseGeocode = (lon, lat, types = 'address,postcode') => {
  mapboxClient.geocodeReverse(
    { longitude: lon, latitude: lat },
    { types },
    (error, res) => {
      if (error) {
        console.log("[ERROR] Reverse geocoding exception:", error); // eslint-disable-line
        return;
      }
      res.features.map(f => console.log('feature:', f.place_name)); // eslint-disable-line
    }
  );
};

/**
 * Performs a reverse lookup of a geographic coordinate to
 * determine what address exists at the given location.
 * In the case of a bounding box will perform a lookup of the
 * center point of the box.
 * 
 * @param {Array<Number>} bounds A geographic bounding box definition
 */
export const reverseGeocodeBox = (bounds) => {
  // reverse geocode to get address for provLoc search
  const { lon, lat } = getBoxCenter(bounds);
  return reverseGeocode(lon, lat);
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
  DOWN: 40
};
