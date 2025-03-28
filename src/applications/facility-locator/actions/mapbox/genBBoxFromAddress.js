import mbxGeo from '@mapbox/mapbox-sdk/services/geocoding';
import {
  isPostcode,
  MAPBOX_QUERY_TYPES,
  CountriesList,
  mapboxClient,
  toRadians,
} from 'platform/utilities/facilities-and-mapbox';

import {
  BOUNDING_RADIUS,
  EXPANDED_BOUNDING_RADIUS,
  LocationType,
  MIN_RADIUS_EXP,
  MIN_RADIUS_NCA,
} from '../../constants';
import {
  GEOCODE_STARTED,
  SEARCH_FAILED,
  SEARCH_QUERY_UPDATED,
  GEOCODE_COMPLETE,
  GEOCODE_FAILED,
} from '../actionTypes';
import { radiusFromBoundingBox } from '../../utils/facilityDistance';

const mbxClient = mbxGeo(mapboxClient);

export const constructBounds = ({
  facilityType,
  longitude,
  latitude,
  expandedRadius,
  useProgressiveDisclosure,
}) => {
  const PPMSTypes = [
    LocationType.CC_PROVIDER,
    LocationType.URGENT_CARE_PHARMACIES,
  ];

  // Use latitude to make the longitude changes relative
  const latitudeModifier = Math.cos(toRadians(latitude));

  // Default to the normal bounding radius
  let searchExpandedLat = expandedRadius
    ? EXPANDED_BOUNDING_RADIUS
    : BOUNDING_RADIUS;
  // Default to longitude same as latitude
  let searchExpandedLon = searchExpandedLat;

  // Do not use for PPMS since it does not use the bounding box
  // latitude is divided into 111.11 km or ~69 mi
  if (facilityType === LocationType.CEMETERY) {
    searchExpandedLat = MIN_RADIUS_NCA / 69;
    searchExpandedLon = MIN_RADIUS_NCA / Math.abs(latitudeModifier * 69);
  } else if (useProgressiveDisclosure && !PPMSTypes.includes(facilityType)) {
    searchExpandedLat = MIN_RADIUS_EXP / 69;
    searchExpandedLon = MIN_RADIUS_EXP / Math.abs(latitudeModifier * 69);
  }

  // Since we do this construction for a box we use absolute value above
  return [
    longitude - searchExpandedLon,
    latitude - searchExpandedLat,
    longitude + searchExpandedLon,
    latitude + searchExpandedLat,
  ];
};

export const processFeaturesBBox = (
  query,
  features,
  dispatch,
  expandedRadius,
  useProgressiveDisclosure,
) => {
  // We never use anything but the first feature
  const firstFeature = features[0] || {};
  if (!firstFeature?.center || !firstFeature.geometry || !firstFeature.id) {
    dispatch({ type: GEOCODE_FAILED });
    dispatch({ type: SEARCH_FAILED, error: { type: 'mapBox' } });
    return;
  }
  // Doesn't always have context, but if it does and it's a zipcode, use it
  const zip = firstFeature.context?.find(v => v.id.includes('postcode')) || {};
  const zipCode = zip.text || firstFeature.place_name;

  // used to generate the surrounding box
  const coordinates = firstFeature.center;
  const [longitude, latitude] = coordinates;

  // used to generate the search coordinates
  const [lng, lat] = firstFeature.geometry.coordinates;

  dispatch({ type: GEOCODE_COMPLETE, payload: [] });

  const minBounds = constructBounds({
    facilityType: query?.facilityType,
    longitude,
    latitude,
    expandedRadius,
    useProgressiveDisclosure,
  });

  // radiusFromBoundingBox returns an array with the first element being the
  // bounding box from the minBounds but the second is either that values or
  // a minimum radius value based on the facility type
  const [, radiusOrMinRadius] = radiusFromBoundingBox(
    [{ ...firstFeature, bbox: minBounds }],
    query?.facilityType,
    useProgressiveDisclosure,
  );
  dispatch({
    type: SEARCH_QUERY_UPDATED,
    payload: {
      ...query,
      radius: radiusOrMinRadius,
      context: zipCode,
      id: Date.now(),
      inProgress: true,
      position: {
        latitude,
        longitude,
      },
      searchCoords: {
        lat,
        lng,
      },
      bounds: minBounds,
      zoomLevel: firstFeature.id.split('.')[0] === 'region' ? 7 : 9,
      currentPage: 1,
      mapBoxQuery: {
        placeName: firstFeature.place_name,
        placeType: firstFeature.place_type?.[0],
      },
      searchArea: null,
    },
  });
};

/**
 * Calculates a bounding box (±BOUNDING_RADIUS°) centering on the current
 * address string as typed by the user.
 *
 * @param {Object<T>} query Current searchQuery state (`searchQuery.searchString` at a minimum)
 * @returns {Function<T>} A thunk for Redux to process OR a failure action object on bad input
 */
export const genBBoxFromAddress = (
  query,
  expandedRadius = false,
  useProgressiveDisclosure = false,
) => {
  // Prevent empty search request to Mapbox, which would result in error, and
  // clear results list to respond with message of no facilities found.
  if (!query.searchString) {
    return {
      type: SEARCH_FAILED,
      error: 'Empty search string/address. Search cancelled.',
    };
  }

  return dispatch => {
    dispatch({ type: GEOCODE_STARTED });

    // commas can be stripped from query if Mapbox is returning unexpected results
    let types = MAPBOX_QUERY_TYPES;
    if (isPostcode(query.searchString?.trim() || '')) {
      types = ['postcode'];
    }
    mbxClient
      .forwardGeocode({
        countries: CountriesList,
        types,
        autocomplete: false, // set this to true when build the predictive search UI (feature-flipped)
        query: query.searchString,
        proximity: 'ip',
      })
      .send()
      .then(({ body: { features } }) =>
        processFeaturesBBox(
          query,
          features,
          dispatch,
          expandedRadius,
          useProgressiveDisclosure,
        ),
      )
      .catch(_e => {
        dispatch({ type: GEOCODE_FAILED });
        dispatch({ type: SEARCH_FAILED, error: { type: 'mapBox' } });
      });
  };
};
