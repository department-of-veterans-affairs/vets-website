import mapboxClient from '../components/MapboxClient';
import {
  reverseGeocodeBox,
  searchCriteraFromCoords,
} from '../utils/mapHelpers';
import {
  SEARCH_STARTED,
  SEARCH_QUERY_UPDATED,
  SEARCH_FAILED,
  FETCH_LOCATION_DETAIL,
  FETCH_LOCATIONS,
  FETCH_SPECIALTIES,
  FETCH_SPECIALTIES_DONE,
  FETCH_SPECIALTIES_FAILED,
  CLEAR_SEARCH_RESULTS,
  CLEAR_SEARCH_TEXT,
  GEOCODE_STARTED,
  GEOCODE_COMPLETE,
  GEOCODE_FAILED,
  GEOCODE_CLEAR_ERROR,
  MAP_MOVED,
} from '../utils/actionTypes';
import LocatorApi from '../api';
import {
  LocationType,
  BOUNDING_RADIUS,
  TypeList,
  CountriesList,
} from '../constants';

import mbxGeo from '@mapbox/mapbox-sdk/services/geocoding';
import { distBetween, radiusFromBoundingBox } from '../utils/facilityDistance';

const mbxClient = mbxGeo(mapboxClient);
/**
 * Sync form state with Redux state.
 * (And implicitly cause updates back in VAMap)
 *
 * @param {Object} query The current state of the Search form
 */
export const updateSearchQuery = query => ({
  type: SEARCH_QUERY_UPDATED,
  payload: { ...query },
});

export const clearSearchResults = () => ({
  type: CLEAR_SEARCH_RESULTS,
});

export const mapMoved = () => ({
  type: MAP_MOVED,
});

/**
 * Get the details of a single VA facility.
 *
 * @param {string} id Facility or Provider ID as provided by the data source
 * @param {Object} location The actual location object if we already have it.
 *                 (This is a kinda hacky way to do a force update of the Redux
 *                  store to set the currently `selectedResult` but ¯\_(ツ)_/¯)
 */
export const fetchVAFacility = (id, location = null) => {
  if (location) {
    return {
      type: FETCH_LOCATION_DETAIL,
      payload: location,
    };
  }

  return async dispatch => {
    dispatch({
      type: SEARCH_STARTED,
      payload: {
        active: true,
      },
    });

    try {
      const data = await LocatorApi.fetchVAFacility(id);
      dispatch({ type: FETCH_LOCATION_DETAIL, payload: data.data });
    } catch (error) {
      dispatch({ type: SEARCH_FAILED, error });
    }
  };
};

/**
 * Gets the details of a single Community Care Provider
 *
 * @param {string} id The NPI/Tax ID of a specific provider
 */
export const fetchProviderDetail = id => async dispatch => {
  dispatch({
    type: SEARCH_STARTED,
    payload: {
      active: true,
    },
  });

  try {
    const data = await LocatorApi.fetchProviderDetail(id);
    dispatch({ type: FETCH_LOCATION_DETAIL, payload: data.data });
  } catch (error) {
    dispatch({ type: SEARCH_FAILED, error });
  }
};

/**
 * Handles all urgent care request (mashup)
 * @param {Object} parameters from the search request
 * @returns {Object} An Object response (locations/providers)
 */
const returnAllUrgentCare = async params => {
  const { address, bounds, locationType, page, center, radius } = params;
  const urgentCareVaData = await LocatorApi.searchWithBounds(
    address,
    bounds,
    locationType,
    'UrgentCare',
    page,
    center,
    radius,
    true,
  );

  const urgentCareNonVaData = await LocatorApi.searchWithBounds(
    address,
    bounds,
    locationType,
    'NonVAUrgentCare',
    page,
    center,
    radius,
    true,
  );

  return {
    meta: {
      pagination: {
        currentPage: 1,
        nextPage: null,
        prevPage: null,
        totalPages: 1,
      },
    },
    links: {},
    data: [...urgentCareNonVaData.data, ...urgentCareVaData.data]
      .map(location => {
        const distance =
          center &&
          distBetween(
            center[0],
            center[1],
            location.attributes.lat,
            location.attributes.long,
          );
        return {
          ...location,
          distance,
        };
      })
      .sort((resultA, resultB) => resultA.distance - resultB.distance)
      .slice(0, 20),
  };
};

/**
 * Handles the actual API call to get the type of locations closest to `address`
 * and/or within the given `bounds`.
 *
 * @param {string=} address Address of the center-point of the search area
 * @param {number[]} bounds Geo-coords of the bounding box of the search area
 * @param {string} locationType (see config.js for valid types)
 * @param {string} serviceType (see config.js for valid types)
 * @param {number} page What page of results to request
 * @param {Function} dispatch Redux's dispatch method
 * @param {number} api version number
 */
export const fetchLocations = async (
  address = null,
  bounds,
  locationType,
  serviceType,
  page,
  dispatch,
  center,
  radius,
) => {
  let data = {};

  try {
    if (
      locationType === LocationType.URGENT_CARE &&
      (!serviceType || serviceType === 'AllUrgentCare')
    ) {
      const allUrgentCareList = await returnAllUrgentCare({
        address,
        bounds,
        locationType,
        page,
        center,
        radius,
      });
      data = allUrgentCareList;
    } else {
      const dataList = await LocatorApi.searchWithBounds(
        address,
        bounds,
        locationType,
        serviceType,
        page,
        center,
        radius,
      );
      data = { ...dataList };
      data.data = dataList.data
        .map(location => {
          const distance =
            center &&
            distBetween(
              center[0],
              center[1],
              location.attributes.lat,
              location.attributes.long,
            );
          return {
            ...location,
            distance,
          };
        })
        .sort((resultA, resultB) => resultA.distance - resultB.distance);
    }
    if (data.errors) {
      dispatch({ type: SEARCH_FAILED, error: data.errors });
    } else {
      dispatch({ type: FETCH_LOCATIONS, payload: data });
    }
  } catch (error) {
    dispatch({ type: SEARCH_FAILED, error });
  }
};

/**
 * Find which locations exist within the given bounding box's area.
 *
 * Allows for filtering on location types and services provided.
 *
 * @param {{bounds: number[], facilityType: string, serviceType: string, page: number, apiVersion: number}}
 */
export const searchWithBounds = ({
  bounds,
  facilityType,
  serviceType,
  page = 1,
  center,
  radius,
}) => {
  const needsAddress = [
    LocationType.CC_PROVIDER,
    LocationType.ALL,
    LocationType.URGENT_CARE_PHARMACIES,
    LocationType.URGENT_CARE,
  ];
  return dispatch => {
    dispatch({
      type: SEARCH_STARTED,
      payload: {
        currentPage: page,
        searchBoundsInProgress: true,
      },
    });

    if (needsAddress.includes(facilityType)) {
      reverseGeocodeBox(bounds).then(address => {
        if (!address) {
          dispatch({
            type: SEARCH_FAILED,
            error:
              'Reverse geocoding failed. See previous errors or network log.',
          });
          return;
        }

        fetchLocations(
          address,
          bounds,
          facilityType,
          serviceType,
          page,
          dispatch,
          center,
          radius,
        );
      });
    } else {
      fetchLocations(
        null,
        bounds,
        facilityType,
        serviceType,
        page,
        dispatch,
        center,
        radius,
      );
    }
  };
};

/**
 * Calculates a bounding box (±BOUNDING_RADIUS°) centering on the current
 * address string as typed by the user.
 *
 * @param {Object<T>} query Current searchQuery state (`searchQuery.searchString` at a minimum)
 * @returns {Function<T>} A thunk for Redux to process OR a failure action object on bad input
 */
export const genBBoxFromAddress = query => {
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
    let types = TypeList;
    // check for postcode search
    const isPostcode = query.searchString.match(/^\s*\d{5}\s*$/);

    if (isPostcode) {
      types = ['postcode'];
    }

    mbxClient
      .forwardGeocode({
        countries: CountriesList,
        types,
        autocomplete: false, // set this to true when build the predictive search UI (feature-flipped)
        query: query.searchString,
      })
      .send()
      .then(({ body: { features } }) => {
        const zip =
          features[0].context.find(v => v.id.includes('postcode')) || {};
        const coordinates = features[0].center;
        const zipCode = zip.text || features[0].place_name;
        const featureBox = features[0].box;

        dispatch({
          type: GEOCODE_COMPLETE,
          payload: query.usePredictiveGeolocation
            ? features.map(feature => ({
                placeName: feature.place_name,
                placeType: feature.place_type[0],
                bbox: feature.bbox,
                center: feature.center,
              }))
            : [],
        });

        let minBounds = [
          coordinates[0] - BOUNDING_RADIUS,
          coordinates[1] - BOUNDING_RADIUS,
          coordinates[0] + BOUNDING_RADIUS,
          coordinates[1] + BOUNDING_RADIUS,
        ];

        if (featureBox) {
          minBounds = [
            Math.min(featureBox[0], coordinates[0] - BOUNDING_RADIUS),
            Math.min(featureBox[1], coordinates[1] - BOUNDING_RADIUS),
            Math.max(featureBox[2], coordinates[0] + BOUNDING_RADIUS),
            Math.max(featureBox[3], coordinates[1] + BOUNDING_RADIUS),
          ];
        }

        const radius = radiusFromBoundingBox(features);

        dispatch({
          type: SEARCH_QUERY_UPDATED,
          payload: {
            ...query,
            radius,
            context: zipCode,
            id: Date.now(),
            inProgress: true,
            position: {
              latitude: coordinates[1],
              longitude: coordinates[0],
            },
            searchCoords: {
              lat: features[0].geometry.coordinates[1],
              lng: features[0].geometry.coordinates[0],
            },
            bounds: minBounds,
            zoomLevel: features[0].id.split('.')[0] === 'region' ? 7 : 9,
            currentPage: 1,
            mapBoxQuery: {
              placeName: features[0].place_name,
              placeType: features[0].place_type[0],
            },
            searchArea: null,
          },
        });
      })
      .catch(_ => {
        dispatch({ type: GEOCODE_FAILED });
        dispatch({ type: SEARCH_FAILED, error: { type: 'mapBox' } });
      });
  };
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
      const types = TypeList;
      mbxClient
        .reverseGeocode({
          countries: CountriesList,
          types,
          query: [lng, lat],
        })
        .send()
        .then(({ body: { features } }) => {
          const zip =
            features[0].context.find(v => v.id.includes('postcode')) || {};
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
        })
        .catch(_ => {
          dispatch({ type: GEOCODE_FAILED });
          dispatch({ type: SEARCH_FAILED, error: { type: 'mapBox' } });
        });
    }
  };
};

/**
 * Preloads all specialties available from CC Providers
 * for the type-ahead component.
 */
export const getProviderSpecialties = () => async dispatch => {
  dispatch({ type: FETCH_SPECIALTIES });

  try {
    const data = await LocatorApi.getProviderSpecialties();
    if (data.errors) {
      dispatch({ type: FETCH_SPECIALTIES_FAILED, error: data.errors });
      return [];
    }
    // Great Success!
    dispatch({ type: FETCH_SPECIALTIES_DONE, data });
    return data;
  } catch (error) {
    dispatch({ type: FETCH_SPECIALTIES_FAILED, error });
    return ['Services Temporarily Unavailable'];
  }
};

export const geolocateUser = () => async dispatch => {
  if (navigator?.geolocation?.getCurrentPosition) {
    dispatch({ type: GEOCODE_STARTED });
    navigator.geolocation.getCurrentPosition(
      async currentPosition => {
        const query = await searchCriteraFromCoords(
          currentPosition.coords.longitude,
          currentPosition.coords.latitude,
        );
        dispatch({ type: GEOCODE_COMPLETE });
        dispatch(updateSearchQuery(query));
      },
      e => {
        dispatch({ type: GEOCODE_FAILED, code: e.code });
      },
    );
  } else {
    dispatch({ type: GEOCODE_FAILED, code: -1 });
  }
};

export const clearGeocodeError = () => async dispatch => {
  dispatch({ type: GEOCODE_CLEAR_ERROR });
};

export const clearSearchText = () => async dispatch => {
  dispatch({ type: CLEAR_SEARCH_TEXT });
};
