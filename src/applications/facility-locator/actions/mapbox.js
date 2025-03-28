import mbxGeo from '@mapbox/mapbox-sdk/services/geocoding';
import {
  isPostcode,
  MAPBOX_QUERY_TYPES,
  CountriesList,
  mapboxClient,
  toRadians,
} from 'platform/utilities/facilities-and-mapbox';
import {
  GEOCODE_CLEAR_ERROR,
  GEOCODE_COMPLETE,
  GEOCODE_FAILED,
  GEOCODE_STARTED,
  GEOLOCATE_USER,
  MAP_MOVED,
  MOBILE_MAP_PIN_SELECTED,
  SEARCH_FAILED,
  SEARCH_QUERY_UPDATED,
} from './actionTypes';
import {
  BOUNDING_RADIUS,
  EXPANDED_BOUNDING_RADIUS,
  LocationType,
  MIN_RADIUS_EXP,
  MIN_RADIUS_NCA,
} from '../constants';
import { distBetween, radiusFromBoundingBox } from '../utils/facilityDistance';
import { updateSearchQuery } from './search';

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

const sendSearchQueryUpdate = ({
  dispatch,
  firstFeature,
  lat,
  latitude,
  lng,
  longitude,
  minBounds,
  query,
  radiusOrMinRadius,
  zipCode,
}) => {
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

export const clearGeocodeError = () => async dispatch => {
  dispatch({ type: GEOCODE_CLEAR_ERROR });
};

/**
 * Separated out from genSearchAreaFromCenter for unit testing
 */
export const sendUpdatedSearchQuery = (
  dispatch,
  features,
  lat,
  lng,
  currentBounds,
) => {
  const zip = features[0].context.find(v => v.id.includes('postcode')) || {};
  const location = zip.text || features[0].place_name;

  // Radius is computed as the distance from the center point
  // to the western edge of the bounding box
  const radius = distBetween(lat, lng, lat, currentBounds[0]);

  dispatch({
    type: SEARCH_QUERY_UPDATED,
    payload: {
      radius,
      searchString: location,
      context: location,
      searchArea: {
        locationString: location,
        locationCoords: {
          lng,
          lat,
        },
      },
      mapBoxQuery: {
        placeName: features[0].place_name,
        placeType: features[0].place_type[0],
      },
      searchCoords: null,
      bounds: currentBounds,
      position: {
        latitude: lat,
        longitude: lng,
      },
    },
  });
};

/**
 * Calculates a human readable location (address, zip, city, state) updated
 * from the coordinates center of the map
 */
export const genSearchAreaFromCenter = query => {
  const { lat, lng, currentMapBoundsDistance, currentBounds } = query;

  return dispatch => {
    if (currentMapBoundsDistance > 500) {
      dispatch({ type: GEOCODE_FAILED });
      dispatch({ type: SEARCH_FAILED, error: { type: 'mapBox' } });
    } else {
      const types = MAPBOX_QUERY_TYPES;

      mbxClient
        .reverseGeocode({
          countries: CountriesList,
          types,
          query: [lng, lat],
        })
        .send()
        .then(({ body: { features } }) => {
          sendUpdatedSearchQuery(dispatch, features, lat, lng, currentBounds);
        })
        .catch(_ => {
          dispatch({ type: GEOCODE_FAILED });
          dispatch({ type: SEARCH_FAILED, error: { type: 'mapBox' } });
        });
    }
  };
};

const getLocationData = async (longitude, latitude) => {
  return mbxClient
    .reverseGeocode({
      query: [longitude, latitude],
      types: ['address'],
    })
    .send();
};

/**
 * Generates search criteria from lat/long geocoordinates.
 */
export const searchCriteriaFromCoords = (response, longitude, latitude) => {
  const { features } = response.body;
  const placeName = features[0].place_name;
  const coordinates = features[0].center;

  return {
    bounds: features[0].bbox || [
      coordinates[0] - BOUNDING_RADIUS,
      coordinates[1] - BOUNDING_RADIUS,
      coordinates[0] + BOUNDING_RADIUS,
      coordinates[1] + BOUNDING_RADIUS,
    ],
    searchString: placeName,
    position: { longitude, latitude },
  };
};

export const geolocateUser = () => async dispatch => {
  const GEOLOCATION_TIMEOUT = 10000;

  if (navigator?.geolocation?.getCurrentPosition) {
    dispatch({ type: GEOLOCATE_USER });

    navigator.geolocation.getCurrentPosition(
      async currentPosition => {
        const { coords } = currentPosition;

        const locationData = await getLocationData(
          coords.longitude,
          coords.latitude,
        );

        const query = searchCriteriaFromCoords(
          locationData,
          coords.longitude,
          coords.latitude,
        );

        dispatch({ type: GEOCODE_COMPLETE });
        dispatch(updateSearchQuery(query));
      },
      e => {
        dispatch({ type: GEOCODE_FAILED, code: e.code });
      },
      { timeout: GEOLOCATION_TIMEOUT },
    );
  } else {
    dispatch({ type: GEOCODE_FAILED, code: -1 });
  }
};

export const mapMoved = currentRadius => ({
  type: MAP_MOVED,
  currentRadius,
});

export const selectMobileMapPin = data => {
  return {
    type: MOBILE_MAP_PIN_SELECTED,
    payload: data,
  };
};
