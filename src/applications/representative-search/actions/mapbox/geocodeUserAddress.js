import mbxGeo from '@mapbox/mapbox-sdk/services/geocoding';
import mapboxClient from '../../components/mapbox/MapboxClient';
import { MAPBOX_QUERY_TYPES, CountriesList } from '../../constants';
import {
  GEOCODE_STARTED,
  SEARCH_QUERY_UPDATED,
  SEARCH_QUERY_COMMITED,
  GEOCODE_COMPLETE,
  GEOCODE_FAILED,
  SEARCH_FAILED,
} from '../../utils/actionTypes';

const mbxClient = mbxGeo(mapboxClient);

/**
 * Geocodes the address string provided by the user.
 *
 * @param {Object<T>} query Current searchQuery state (`searchQuery.locationQueryString` at a minimum)
 * @returns {Function<T>} A thunk for Redux to process OR a failure action object on bad input
 */
export const geocodeUserAddress = query => {
  // Prevent empty search request to Mapbox, which would result in error.
  if (!query.locationInputString) {
    return {
      type: GEOCODE_FAILED,
      error: 'Empty search string/address. Search cancelled.',
    };
  }

  return dispatch => {
    dispatch({ type: GEOCODE_STARTED });

    const types = MAPBOX_QUERY_TYPES;

    mbxClient
      .forwardGeocode({
        countries: CountriesList,
        types,
        autocomplete: false, // set this to true when building the predictive search UI (feature-flipped)
        query: query.locationInputString,
      })
      .send()
      .then(({ body: { features } }) => {
        dispatch({
          type: GEOCODE_COMPLETE,
          payload: query.usePredictiveGeolocation
            ? features.map(feature => ({
                placeName: feature.place_name,
                placeType: feature.place_type[0],
                center: feature.center,
              }))
            : [],
        });

        const queryUpdatePayload = {
          ...query,
          context: {
            location: query.locationInputString,
            repOrgName: query.representativeInputString,
          },
          page: 1,
          id: Date.now(),
          inProgress: true,
          position: {
            latitude: features[0].center[1],
            longitude: features[0].center[0],
          },
          mapBoxQuery: {
            placeName: features[0].place_name,
            placeType: features[0].place_type[0],
          },
          searchArea: query.searchArea,
          address: query.locationInputString,
          locationQueryString: query.locationInputString,
          representativeQueryString: query.representativeInputString,
          representativeType: query.representativeType,
        };

        const queryCommitPayload = (({ committedSearchQuery, ...rest }) => rest)(queryUpdatePayload);

        dispatch({
          type: SEARCH_QUERY_UPDATED,
          payload: queryUpdatePayload,
        });

        dispatch({
          type: SEARCH_QUERY_COMMITED,
          payload: queryCommitPayload,
        });
      })
      .catch(_ => {
        dispatch({ type: GEOCODE_FAILED });
        dispatch({ type: SEARCH_FAILED });
      });
  };
};
