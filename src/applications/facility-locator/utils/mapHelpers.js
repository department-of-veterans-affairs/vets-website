import mbxGeo from '@mapbox/mapbox-sdk/services/geocoding';
import {
  MAPBOX_QUERY_TYPES,
  CountriesList,
  mapboxClient,
  isPostcode,
} from 'platform/utilities/facilities-and-mapbox';

const mbxClient = mbxGeo(mapboxClient);

/** ****************************************************
 * Helper functions specifically requiring the
 * MapboxClient API.
 *
 * Note: Be careful when unit testing these, causes a
 * node issue when going through the import chain.
 * Likely best to try the mock API from Mapbox.
 ***************************************************** */

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
export const getBoxCenter = bounds => {
  if (bounds && bounds.length === 4) {
    const lonDiff = (bounds[2] - bounds[0]) / 2;
    const latDiff = (bounds[3] - bounds[1]) / 2;

    return { lon: bounds[0] + lonDiff, lat: bounds[1] + latDiff };
  }

  return {};
};

// Separated out for unit testing
export const getPlaceName = response => {
  if (
    response.body &&
    response.body.features &&
    response.body.features.length > 0
  ) {
    const {
      features: {
        0: { place_name: placeName },
      },
    } = response.body;

    return placeName;
  }

  return null;
};

/**
 * Performs a reverse lookup of a geographic coordinate to
 * determine what address exists at the given location.
 *
 * @param {Number} lon Longitude coordinate
 * @param {Number} lat Latitude coordinate
 *   https://www.mapbox.com/api-documentation/?language=JavaScript#retrieve-places-near-a-location
 *   default => `[address,postcode]`
 *
 * @returns {String} The best approximation of the address for the coordinates
 */
export const reverseGeocode = async (lon, lat, types) => {
  const response = await mbxClient
    .reverseGeocode({ query: [lon, lat], types })
    .send()
    .catch();

  return getPlaceName(response);
};

/**
 * Performs a reverse lookup of a geographic coordinate to
 * determine what address exists at the given location.
 * In the case of a bounding box will perform a lookup of the
 * center point of the box.
 *
 * @param {Array<Number>} bounds A geographic bounding box definition
 * @param @param {String} types A valid type-of-address string as defined by the Mapbox API:
 *   https://www.mapbox.com/api-documentation/?language=JavaScript#retrieve-places-near-a-location
 *   default => `[address,postcode]`
 *
 * @returns {String} The best approximation of the address for the coordinates
 */

export const reverseGeocodeBox = (
  bounds,
  types = MAPBOX_QUERY_TYPES.join(','),
) => {
  const { lon, lat } = getBoxCenter(bounds);
  return reverseGeocode(lon, lat, types.split(','));
};

export const searchAddresses = async addressTerm => {
  let types = MAPBOX_QUERY_TYPES;

  if (isPostcode(addressTerm?.trim() || '')) {
    types = ['postcode'];
  }

  const response = await mbxClient
    .forwardGeocode({
      countries: CountriesList,
      types,
      autocomplete: true,
      query: addressTerm,
      proximity: 'ip',
    })
    .send();

  return response?.body?.features ?? [];
};
