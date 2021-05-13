import appendQuery from 'append-query';

import { api } from '../config';

import { fetchAndUpdateSessionExpiration as fetch } from 'platform/utilities/api';

import { rubyifyKeys } from '../utils/helpers';
import { BOUNDING_RADIUS, TypeList, CountriesList } from '../constants';
import { radiusFromBoundingBox } from '../utils/mapHelpers';
import mbxGeo from '@mapbox/mapbox-sdk/services/geocoding';
import mapboxClient from '../components/MapboxClient';

const mbxClient = mbxGeo(mapboxClient);

export const AUTOCOMPLETE_STARTED = 'AUTOCOMPLETE_STARTED';
export const AUTOCOMPLETE_FAILED = 'AUTOCOMPLETE_FAILED';
export const AUTOCOMPLETE_SUCCEEDED = 'AUTOCOMPLETE_SUCCEEDED';
export const AUTOCOMPLETE_CLEARED = 'AUTOCOMPLETE_CLEARED';
export const AUTOCOMPLETE_TERM_CHANGED = 'AUTOCOMPLETE_TERM_CHANGED';
export const BENEFICIARY_ZIP_CODE_CHANGED = 'BENEFICIARY_ZIP_CODE_CHANGED';
export const CALCULATOR_INPUTS_CHANGED = 'CALCULATOR_INPUTS_CHANGED';
export const DISPLAY_MODAL = 'DISPLAY_MODAL';
export const ELIGIBILITY_CHANGED = 'ELIGIBILITY_CHANGED';
export const ENTER_PREVIEW_MODE = 'ENTER_PREVIEW_MODE';
export const EXIT_PREVIEW_MODE = 'EXIT_PREVIEW_MODE';
export const FETCH_BAH_STARTED = 'FETCH_BAH_STARTED';
export const FETCH_BAH_FAILED = 'FETCH_BAH_FAILED';
export const FETCH_BAH_SUCCEEDED = 'FETCH_BAH_SUCCEEDED';
export const FETCH_CONSTANTS_FAILED = 'FETCH_CONSTANTS_FAILED';
export const FETCH_CONSTANTS_STARTED = 'FETCH_CONSTANTS_STARTED';
export const FETCH_CONSTANTS_SUCCEEDED = 'FETCH_CONSTANTS_SUCCEEDED';
export const FETCH_PROFILE_FAILED = 'FETCH_PROFILE_FAILED';
export const FETCH_PROFILE_STARTED = 'FETCH_PROFILE_STARTED';
export const FETCH_PROFILE_SUCCEEDED = 'FETCH_PROFILE_SUCCEEDED';
export const FILTER_TOGGLED = 'FILTER_TOGGLED';
export const GEOCODE_STARTED = 'GEOCODE_STARTED';
export const GEOCODE_FAILED = 'GEOCODE_FAILED';
export const GEOCODE_COMPLETE = 'GEOCODE_COMPLETE';
export const GEOCODE_CLEAR_ERROR = 'GEOCODE_CLEAR_ERROR';
export const GEOLOCATE_USER = 'GEOLOCATE_USER';
export const INSTITUTION_FILTERS_CHANGED = 'INSTITUTION_FILTERS_CHANGED';
export const SEARCH_BY_NAME_SUCCEEDED = 'SEARCH_BY_NAME_SUCCEEDED';
export const SEARCH_BY_LOCATION_SUCCEEDED = 'SEARCH_BY_LOCATION_SUCCEEDED';
export const SEARCH_BY_LOCATION_UPDATED = 'SEARCH_BY_LOCATION_UPDATED';
export const SEARCH_FAILED = 'SEARCH_FAILED';
export const SEARCH_STARTED = 'SEARCH_STARTED';
export const SET_PAGE_TITLE = 'SET_PAGE_TITLE';
export const SET_VERSION = 'SET_VERSION';
export const UPDATE_ESTIMATED_BENEFITS = 'UPDATE_ESTIMATED_BENEFITS';
export const UPDATE_ROUTE = 'UPDATE_ROUTE';

export function enterPreviewMode(version) {
  return {
    type: ENTER_PREVIEW_MODE,
    version,
  };
}

export function exitPreviewMode() {
  return {
    type: EXIT_PREVIEW_MODE,
  };
}

export function setPageTitle(title) {
  return {
    type: SET_PAGE_TITLE,
    title,
  };
}

export function showModal(modal) {
  return {
    type: DISPLAY_MODAL,
    modal,
  };
}

export function hideModal() {
  return showModal(null);
}

function withPreview(dispatch, action) {
  const version = action.payload.meta.version;
  if (version.preview) {
    dispatch({
      type: ENTER_PREVIEW_MODE,
      version,
    });
  } else if (version.createdAt) {
    dispatch({
      type: SET_VERSION,
      version,
    });
  }

  dispatch(action);
}

export function fetchProfile(facilityCode, version) {
  const queryString = version ? `?version=${version}` : '';
  const url = `${api.url}/institutions/${facilityCode}${queryString}`;

  return (dispatch, getState) => {
    dispatch({ type: FETCH_PROFILE_STARTED });

    return fetch(url, api.settings)
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        throw new Error(res.statusText);
      })
      .then(institution => {
        const { AVGVABAH, AVGDODBAH } = getState().constants.constants;
        return withPreview(dispatch, {
          type: FETCH_PROFILE_SUCCEEDED,
          payload: {
            ...institution,
            AVGVABAH,
            AVGDODBAH,
          },
        });
      })
      .catch(err => {
        dispatch({
          type: FETCH_PROFILE_FAILED,
          payload: err.message,
        });
      });
  };
}

export function fetchConstants(version) {
  const queryString = version ? `?version=${version}` : '';
  const url = `${api.url}/calculator_constants${queryString}`;
  return dispatch => {
    dispatch({ type: FETCH_CONSTANTS_STARTED });
    return fetch(url, api.settings)
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        throw new Error(res.statusText);
      })
      .then(payload => {
        withPreview(dispatch, { type: FETCH_CONSTANTS_SUCCEEDED, payload });
      })
      .catch(err => {
        dispatch({
          type: FETCH_CONSTANTS_FAILED,
          payload: err.message,
        });
      });
  };
}

export function eligibilityChange(eligibility) {
  return { type: ELIGIBILITY_CHANGED, payload: eligibility };
}

export function institutionFilterChange(filters) {
  return { type: INSTITUTION_FILTERS_CHANGED, payload: filters };
}

export function updateEligibilityAndFilters(eligibility, filters) {
  return dispatch => {
    dispatch({ type: ELIGIBILITY_CHANGED, payload: eligibility });
    dispatch({ type: INSTITUTION_FILTERS_CHANGED, payload: filters });
  };
}

const beneficiaryZIPRegExTester = /\b\d{5}\b/;

export function beneficiaryZIPCodeChanged(beneficiaryZIP) {
  // pass input through to reducers if not five digits
  if (!beneficiaryZIPRegExTester.exec(beneficiaryZIP)) {
    return {
      type: BENEFICIARY_ZIP_CODE_CHANGED,
      beneficiaryZIP,
    };
  }

  const url = `${api.url}/zipcode_rates/${beneficiaryZIP}`;

  return dispatch => {
    fetch(url, api.settings)
      .then(res => {
        if (res.ok) {
          return res.json();
        }

        return res.json().then(({ errors }) => {
          throw new Error(errors[0].title);
        });
      })
      .then(payload => {
        dispatch({
          beneficiaryZIPFetched: beneficiaryZIP,
          type: FETCH_BAH_SUCCEEDED,
          payload,
        });
      })
      .catch(error => {
        dispatch({
          beneficiaryZIPFetched: beneficiaryZIP,
          type: FETCH_BAH_FAILED,
          error,
        });
      });

    dispatch({
      type: FETCH_BAH_STARTED,
      beneficiaryZIPFetched: beneficiaryZIP,
    });
  };
}

export function calculatorInputChange({ field, value }) {
  return {
    type: CALCULATOR_INPUTS_CHANGED,
    field,
    value,
  };
}

export function updateEstimatedBenefits(estimatedBenefits) {
  return { type: UPDATE_ESTIMATED_BENEFITS, estimatedBenefits };
}

export function fetchSearchByNameResults(name) {
  const url = appendQuery(
    `${api.url}/institutions/search`,
    rubyifyKeys({ name }),
  );

  return dispatch => {
    dispatch({ type: SEARCH_STARTED, payload: { name } });

    return fetch(url, api.settings)
      .then(res => {
        if (res.ok) {
          return res.json();
        }

        throw new Error(res.statusText);
      })
      .then(payload =>
        withPreview(dispatch, {
          type: SEARCH_BY_NAME_SUCCEEDED,
          payload,
        }),
      )
      .catch(err => {
        dispatch({
          type: SEARCH_FAILED,
          payload: err.message,
        });
      });
  };
}

export function fetchNameAutocompleteSuggestions(term, filterFields, version) {
  const url = appendQuery(`${api.url}/institutions/autocomplete`, {
    term,
    ...rubyifyKeys(filterFields),
    version,
  });
  return dispatch =>
    fetch(url, api.settings)
      .then(res => {
        if (res.ok) {
          return res.json();
        }

        return res.json().then(({ errors }) => {
          throw new Error(errors[0].title);
        });
      })
      .then(payload => dispatch({ type: AUTOCOMPLETE_SUCCEEDED, payload }))
      .catch(err => {
        dispatch({ type: AUTOCOMPLETE_FAILED, err });
      });
}

/**
 * Calculates a bounding box (±BOUNDING_RADIUS°) centering on the current
 * address string as typed by the user.
 *
 * @param features return object from MapBox
 * @param {Object<T>} query Current searchQuery state (`searchQuery.searchString` at a minimum)
 * @returns {Function<T>} A thunk for Redux to process OR a failure action object on bad input
 */
export const genBBoxFromAddress = (features, query) => {
  const zip = features[0].context.find(v => v.id.includes('postcode')) || {};
  const coordinates = features[0].center;
  const latitude = coordinates[1];
  const longitude = coordinates[0];
  const zipCode = zip.text || features[0].place_name;
  const featureBox = features[0].box;

  let minBounds = [
    longitude - BOUNDING_RADIUS,
    latitude - BOUNDING_RADIUS,
    longitude + BOUNDING_RADIUS,
    latitude + BOUNDING_RADIUS,
  ];

  if (featureBox) {
    minBounds = [
      Math.min(featureBox[0], longitude - BOUNDING_RADIUS),
      Math.min(featureBox[1], latitude - BOUNDING_RADIUS),
      Math.max(featureBox[2], longitude + BOUNDING_RADIUS),
      Math.max(featureBox[3], latitude + BOUNDING_RADIUS),
    ];
  }

  const radius = radiusFromBoundingBox(features);

  return dispatch => {
    dispatch({
      type: GEOCODE_COMPLETE,
      payload: {
        ...query,
        radius,
        context: zipCode,
        id: Date.now(),
        inProgress: true,
        position: {
          latitude,
          longitude,
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
        results: query.usePredictiveGeolocation
          ? features.map(feature => ({
              placeName: feature.place_name,
              placeType: feature.place_type[0],
              bbox: feature.bbox,
              center: feature.center,
            }))
          : [],
      },
    });
  };
};

/**
 * Finds results based on parameters for action SEARCH_BY_LOCATION_SUCCEEDED
 */
export function fetchSearchByLocationResults(query, distance) {
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
        genBBoxFromAddress(features, query);

        const coordinates = features[0].center;
        const latitude = coordinates[1];
        const longitude = coordinates[0];
        const url = appendQuery(
          `${api.url}/institutions/search`,
          rubyifyKeys({ latitude, longitude, distance }),
        );
        dispatch({
          type: SEARCH_STARTED,
          payload: { latitude, longitude, distance },
        });

        return fetch(url, api.settings)
          .then(res => {
            if (res.ok) {
              return res.json();
            }

            throw new Error(res.statusText);
          })
          .then(payload =>
            withPreview(dispatch, {
              type: SEARCH_BY_LOCATION_SUCCEEDED,
              payload,
            }),
          )
          .catch(err => {
            dispatch({
              type: SEARCH_FAILED,
              payload: err.message,
            });
          });
      })
      .catch(_ => {
        dispatch({ type: GEOCODE_FAILED });
        dispatch({ type: SEARCH_FAILED, error: { type: 'mapBox' } });
      });
  };
}
