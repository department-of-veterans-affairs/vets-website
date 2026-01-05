import appendQuery from 'append-query';

import { fetchAndUpdateSessionExpiration as fetch } from 'platform/utilities/api';
import mbxGeo from '@mapbox/mapbox-sdk/services/geocoding';
import { api, apiV0 } from '../config';

import { rubyifyKeys, searchCriteriaFromCoords } from '../utils/helpers';
import { TypeList } from '../constants';
import mapboxClient from '../components/MapboxClient';
import { buildSearchFilters } from '../selectors/filters';

const mbxClient = mbxGeo(mapboxClient);

export const ADD_COMPARE_INSTITUTION = 'ADD_COMPARE_INSTITUTION';
export const AUTOCOMPLETE_STARTED = 'AUTOCOMPLETE_STARTED';
export const AUTOCOMPLETE_FAILED = 'AUTOCOMPLETE_FAILED';
export const BENEFICIARY_ZIP_CODE_CHANGED = 'BENEFICIARY_ZIP_CODE_CHANGED';
export const CALCULATOR_INPUTS_CHANGED = 'CALCULATOR_INPUTS_CHANGED';
export const COMPARE_DRAWER_OPENED = 'COMPARE_DRAWER_OPENED';
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
export const FILTERS_CHANGED = 'FILTERS_CHANGED';
export const FILTER_TOGGLED = 'FILTER_TOGGLED';
export const GEOCODE_COMPLETE = 'GEOCODE_COMPLETE';
export const GEOCODE_STARTED = 'GEOCODE_STARTED';
export const GEOCODE_FAILED = 'GEOCODE_FAILED';
export const GEOCODE_LOCATION_FAILED = 'GEOCODE_LOCATION_FAILED';
export const GEOCODE_SUCCEEDED = 'GEOCODE_SUCCEEDED';
export const GEOLOCATE_USER = 'GEOLOCATE_USER';
export const GEOCODE_CLEAR_ERROR = 'GEOCODE_CLEAR_ERROR';
export const INSTITUTION_FILTERS_CHANGED = 'INSTITUTION_FILTERS_CHANGED';
export const LOCATION_AUTOCOMPLETE_SUCCEEDED =
  'LOCATION_AUTOCOMPLETE_SUCCEEDED';
export const MAP_CHANGED = 'MAP_CHANGED';
export const NAME_AUTOCOMPLETE_SUCCEEDED = 'NAME_AUTOCOMPLETE_SUCCEEDED';
export const REMOVE_COMPARE_INSTITUTION = 'REMOVE_COMPARE_INSTITUTION';
export const SEARCH_BY_FACILITY_CODES_SUCCEEDED =
  'SEARCH_BY_FACILITY_CODES_SUCCEEDED';
export const SEARCH_BY_NAME_SUCCEEDED = 'SEARCH_BY_NAME_SUCCEEDED';
export const SEARCH_BY_LOCATION_SUCCEEDED = 'SEARCH_BY_LOCATION_SUCCEEDED';
export const SEARCH_FAILED = 'SEARCH_FAILED';
export const SEARCH_QUERY_UPDATED = 'SEARCH_QUERY_UPDATED';
export const SEARCH_STARTED = 'SEARCH_STARTED';
export const FETCH_COMPARE_FAILED = 'FETCH_COMPARE_FAILED';
export const SET_PAGE_TITLE = 'SET_PAGE_TITLE';
export const UPDATE_AUTOCOMPLETE_NAME = 'UPDATE_AUTOCOMPLETE_NAME';
export const UPDATE_AUTOCOMPLETE_LOCATION = 'UPDATE_AUTOCOMPLETE_LOCATION';
export const UPDATE_COMPARE_DETAILS = 'UPDATE_COMPARE_DETAILS';
export const UPDATE_CURRENT_SEARCH_TAB = 'UPDATE_CURRENT_TAB';
export const UPDATE_ESTIMATED_BENEFITS = 'UPDATE_ESTIMATED_BENEFITS';
export const SET_ERROR = 'SET_ERROR';
export const FILTER_BEFORE_RESULTS = 'FILTER_BEFORE_RESULTS';
export const UPDATE_QUERY_PARAMS = 'UPDATE_QUERY_PARAMS';
export const FOCUS_SEARCH = 'FOCUS_SEARCH';

export const FETCH_LC_RESULTS_FAILED = 'FETCH_LC_RESULTS_FAILED';
export const FETCH_LC_RESULTS_STARTED = 'FETCH_LC_RESULTS_STARTED';
export const FETCH_LC_RESULTS_SUCCEEDED = 'FETCH_LC_RESULTS_SUCCEEDED';
export const FETCH_LC_RESULT_FAILED = 'FETCH_LC_RESULT_FAILED';
export const FETCH_LC_RESULT_STARTED = 'FETCH_LC_RESULT_STARTED';
export const FETCH_LC_RESULT_SUCCEEDED = 'FETCH_LC_RESULT_SUCCEEDED';
export const FILTER_LC_RESULTS = 'FILTER_LC_RESULTS';

export const FETCH_INSTITUTION_PROGRAMS_FAILED =
  'FETCH_INSTITUTION_PROGRAMS_FAILED';
export const FETCH_INSTITUTION_PROGRAMS_STARTED =
  'FETCH_INSTITUTION_PROGRAMS_STARTED';
export const FETCH_INSTITUTION_PROGRAMS_SUCCEEDED =
  'FETCH_INSTITUTION_PROGRAMS_SUCCEEDED';
export const FETCH_NATIONAL_EXAMS_FAILED = 'FETCH_NATIONAL_EXAMS_FAILED ';
export const FETCH_NATIONAL_EXAMS_STARTED = 'FETCH_NATIONAL_EXAMS_STARTED';
export const FETCH_NATIONAL_EXAMS_SUCCEEDED = 'FETCH_NATIONAL_EXAMS_SUCCEEDED';
export const FETCH_NATIONAL_EXAM_DETAILS_FAILED =
  'FETCH_NATIONAL_EXAM_DETAILS_FAILED ';
export const FETCH_NATIONAL_EXAM_DETAILS_STARTED =
  'FETCH_NATIONAL_EXAM_DETAILS_STARTED';
export const FETCH_NATIONAL_EXAM_DETAILS_SUCCEEDED =
  'FETCH_NATIONAL_EXAM_DETAILS_SUCCEEDED';

const getSearchByLocationParams = (filters, description, name) => {
  if (description) {
    return {
      description,
    };
  }

  if (name) {
    return {
      name,
    };
  }

  return {
    ...rubyifyKeys(filters && buildSearchFilters(filters)),
  };
};

export const fetchNationalExamDetails = id => {
  const url = `${api.url}/lcpe/exams/${id}`;
  return async dispatch => {
    dispatch({
      type: FETCH_NATIONAL_EXAM_DETAILS_STARTED,
    });

    try {
      const res = await fetch(url, api.settings);
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      const { exam } = await res.json();
      dispatch({
        type: FETCH_NATIONAL_EXAM_DETAILS_SUCCEEDED,
        payload: exam,
      });
    } catch (err) {
      dispatch({
        type: FETCH_NATIONAL_EXAM_DETAILS_FAILED,
        payload: err.message,
      });
    }
  };
};

export const fetchNationalExams = () => {
  const url = `${api.url}/lcpe/exams`;
  return async dispatch => {
    dispatch({
      type: FETCH_NATIONAL_EXAMS_STARTED,
    });

    try {
      const res = await fetch(url, api.settings);
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      const { exams } = await res.json();
      dispatch({
        type: FETCH_NATIONAL_EXAMS_SUCCEEDED,
        payload: exams,
      });
    } catch (err) {
      dispatch({
        type: FETCH_NATIONAL_EXAMS_FAILED,
        payload: err.message,
      });
    }
  };
};

export const fetchInstitutionPrograms = (facilityCode, programType) => {
  const url = `${
    apiV0.url
  }/institution_programs/search?type=${programType}&facility_code=${facilityCode}&disable_pagination=true`;
  return async dispatch => {
    dispatch({ type: FETCH_INSTITUTION_PROGRAMS_STARTED });

    try {
      const res = await fetch(url, apiV0.settings);
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      const { data } = await res.json();
      dispatch({
        type: FETCH_INSTITUTION_PROGRAMS_SUCCEEDED,
        payload: data,
      });
    } catch (err) {
      dispatch({
        type: FETCH_INSTITUTION_PROGRAMS_FAILED,
        payload: err.message,
      });
    }
  };
};

export function filterLcResults(
  name,
  categories,
  location = 'all',
  previousResults = [],
) {
  return {
    type: FILTER_LC_RESULTS,
    payload: { name, categories, location, previousResults },
  };
}

export function fetchLicenseCertificationResults() {
  const url = `${api.url}/lcpe/lacs`;

  return async dispatch => {
    dispatch({ type: FETCH_LC_RESULTS_STARTED });

    try {
      const res = await fetch(url, {
        ...api.settings,
      });

      if (!res.ok) {
        throw new Error(res.statusText);
      }

      const { lacs } = await res.json();
      dispatch({
        type: FETCH_LC_RESULTS_SUCCEEDED,
        payload: lacs,
      });
    } catch (err) {
      if (err.name !== 'AbortError') {
        dispatch({
          type: FETCH_LC_RESULTS_FAILED,
          payload: err.message,
        });
      }
    }
  };
}

export function fetchLcResult(id) {
  return async dispatch => {
    const url = `${api.url}/lcpe/lacs/${id}`;
    dispatch({ type: FETCH_LC_RESULT_STARTED });

    try {
      const res = await fetch(url, {
        ...api.settings,
      });

      if (!res.ok) {
        throw new Error(res.statusText);
      }
      const { lac } = await res.json();
      dispatch({
        type: FETCH_LC_RESULT_SUCCEEDED,
        payload: lac,
      });
    } catch (err) {
      if (err.name !== 'AbortError') {
        dispatch({
          type: FETCH_LC_RESULT_FAILED,
          payload: err.message,
        });
      }
    }
  };
}

export const focusSearch = () => {
  return {
    type: FOCUS_SEARCH,
  };
};
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
        const name = institution?.data?.attributes?.name;
        if (name) {
          localStorage.setItem('institutionName', name);
        }
        const { AVGVABAH, AVGDODBAH } = getState().constants.constants;
        return dispatch({
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
        dispatch({ type: FETCH_CONSTANTS_SUCCEEDED, payload });
      })
      .catch(err => {
        dispatch({
          type: FETCH_CONSTANTS_FAILED,
          payload: err.message,
        });
      });
  };
}

export function eligibilityChange(fields) {
  return { type: ELIGIBILITY_CHANGED, payload: { ...fields } };
}

export function filterChange(filters) {
  return { type: FILTERS_CHANGED, payload: filters };
}

export function updateEligibilityAndFilters(eligibility, filters) {
  return dispatch => {
    dispatch({ type: ELIGIBILITY_CHANGED, payload: eligibility });
    dispatch({ type: FILTERS_CHANGED, payload: filters });
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

export function fetchSearchByNameResults(name, page, filters, version) {
  const params = { name, page, ...rubyifyKeys(buildSearchFilters(filters)) };
  if (version) {
    params.version = version;
  }
  const url = appendQuery(`${api.url}/institutions/search`, params);

  return dispatch => {
    dispatch({ type: SEARCH_STARTED, payload: { name } });

    return fetch(url, api.settings)
      .then(res => {
        if (res.ok) {
          return res.json();
        }

        throw new Error(res.statusText);
      })
      .then(payload => {
        dispatch({
          type: SEARCH_BY_NAME_SUCCEEDED,
          payload,
        });
      })
      .catch(err => {
        dispatch({
          type: SEARCH_FAILED,
          payload: err.message,
        });
      });
  };
}

export function updateAutocompleteName(name) {
  return {
    type: UPDATE_AUTOCOMPLETE_NAME,
    payload: name,
  };
}

export function updateAutocompleteLocation(location) {
  return {
    type: UPDATE_AUTOCOMPLETE_LOCATION,
    payload: location,
  };
}

export function changeSearchTab(tab) {
  return {
    type: UPDATE_CURRENT_SEARCH_TAB,
    tab,
  };
}

export function fetchNameAutocompleteSuggestions(name, filterFields, version) {
  if (name === '' || name === null || name === undefined) {
    return { type: NAME_AUTOCOMPLETE_SUCCEEDED, payload: [] };
  }

  const url = appendQuery(`${api.url}/institutions/autocomplete`, {
    term: name,
    ...rubyifyKeys(filterFields),
    version,
  });
  return dispatch => {
    dispatch({ type: AUTOCOMPLETE_STARTED });
    fetch(url, api.settings)
      .then(res => {
        if (res.ok) {
          return res.json();
        }

        return res.json().then(({ errors }) => {
          throw new Error(errors[0].title);
        });
      })
      .then(res =>
        dispatch({ type: NAME_AUTOCOMPLETE_SUCCEEDED, payload: res.data }),
      )
      .catch(err => {
        dispatch({ type: AUTOCOMPLETE_FAILED, err });
      });
  };
}

export function fetchLocationAutocompleteSuggestions(location) {
  if (location === '' || location === null || location === undefined) {
    return { type: LOCATION_AUTOCOMPLETE_SUCCEEDED, payload: [] };
  }

  return dispatch => {
    dispatch({ type: AUTOCOMPLETE_STARTED });

    mbxClient
      .forwardGeocode({
        types: location.match(/^\s*\d{5}\s*$/) ? ['postcode'] : TypeList,
        autocomplete: true,
        query: location,
        limit: 6,
      })
      .send()
      .then(({ body: { features } }) => {
        dispatch({ type: LOCATION_AUTOCOMPLETE_SUCCEEDED, payload: features });
      })
      .catch(err => {
        dispatch({
          type: AUTOCOMPLETE_FAILED,
          payload: err.message,
        });
      });
  };
}

export function fetchSearchByLocationCoords(
  location,
  coordinates,
  distance,
  filters,
  version,
  description,
  name,
) {
  const [longitude, latitude] = coordinates;
  /**
   * description - search by program
   * name - search by name
   * else - search by location w/ filters
   */
  const params = {
    latitude,
    longitude,
    distance,
    ...getSearchByLocationParams(filters, description, name),
  };

  if (version) {
    params.version = version;
  }
  const url = appendQuery(`${api.url}/institutions/search`, params);
  return dispatch => {
    dispatch({
      type: SEARCH_STARTED,
      payload: { location, latitude, longitude, distance, description },
    });

    return fetch(url, api.settings)
      .then(res => {
        if (res.ok) {
          dispatch(
            updateEligibilityAndFilters(
              { expanded: false },
              { expanded: false },
            ),
          );
          return res.json();
        }

        throw new Error(res.statusText);
      })
      .then(payload => {
        dispatch({
          type: SEARCH_BY_LOCATION_SUCCEEDED,
          payload,
        });
      })
      .catch(err => {
        dispatch({
          type: SEARCH_FAILED,
          payload: err.message,
        });
      });
  };
}

/**
 * Finds results based on parameters for action SEARCH_BY_LOCATION_SUCCEEDED
 */
export function fetchSearchByLocationResults(
  location,
  distance,
  filters,
  version,
  description,
  name,
) {
  // Prevent empty search request to Mapbox, which would result in error, and
  // clear results list to respond with message of no facilities found.
  if (!location) {
    return {
      type: SEARCH_FAILED,
      payload: 'Empty search string/address. Search cancelled.',
    };
  }

  return dispatch => {
    dispatch({ type: GEOCODE_STARTED, payload: { location, distance } });

    mbxClient
      .forwardGeocode({
        types: location.match(/^\s*\d{5}\s*$/) ? ['postcode'] : TypeList,
        autocomplete: false,
        query: location,
      })
      .send()
      .then(({ body: { features } }) => {
        dispatch({ type: GEOCODE_SUCCEEDED, payload: features });

        dispatch(
          fetchSearchByLocationCoords(
            location,
            features[0].center,
            distance,
            filters,
            version,
            description,
            name,
          ),
        );
      })
      .catch(err => {
        dispatch({
          type: GEOCODE_FAILED,
          payload: err.message,
        });
      });
  };
}

export function fetchCompareDetails(facilityCodes, filters, version) {
  const params = rubyifyKeys({
    facilityCodes,
    ...buildSearchFilters(filters),
  });
  if (version) {
    params.version = version;
  }
  const url = appendQuery(`${api.url}/institutions/search`, params);

  return dispatch => {
    return fetch(url, api.settings)
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        throw new Error(res.statusText);
      })
      .then(payload => {
        dispatch({
          type: UPDATE_COMPARE_DETAILS,
          payload: payload.data,
        });
      })
      .catch(err => {
        dispatch({
          type: FETCH_COMPARE_FAILED,
          payload: err.message,
        });
      });
  };
}

export function addCompareInstitution(institution) {
  return dispatch => {
    dispatch({ type: ADD_COMPARE_INSTITUTION, payload: institution });
  };
}

export function removeCompareInstitution(facilityCode) {
  return dispatch => {
    dispatch({ type: REMOVE_COMPARE_INSTITUTION, payload: facilityCode });
  };
}

export const geolocateUser = () => async dispatch => {
  const GEOLOCATION_TIMEOUT = 10000;
  if (navigator?.geolocation?.getCurrentPosition) {
    dispatch({ type: GEOLOCATE_USER });
    navigator.geolocation.getCurrentPosition(
      async currentPosition => {
        const query = await searchCriteriaFromCoords(
          currentPosition.coords.longitude,
          currentPosition.coords.latitude,
        );
        dispatch({ type: GEOCODE_COMPLETE, payload: { ...query } });
      },
      e => {
        dispatch({ type: GEOCODE_LOCATION_FAILED, code: e.code });
      },
      { timeout: GEOLOCATION_TIMEOUT },
    );
  } else {
    dispatch({ type: GEOCODE_LOCATION_FAILED, code: -1 });
  }
};

export const clearGeocodeError = () => async dispatch => {
  dispatch({ type: GEOCODE_CLEAR_ERROR });
};

export function updateQueryParams(queryParams) {
  return dispatch => {
    dispatch({ type: UPDATE_QUERY_PARAMS, payload: queryParams });
  };
}

export function compareDrawerOpened(open) {
  return dispatch => {
    dispatch({ type: COMPARE_DRAWER_OPENED, payload: open });
  };
}

export function mapChanged(mapState) {
  return dispatch => {
    dispatch({ type: MAP_CHANGED, payload: mapState });
  };
}

export const setError = error => {
  return {
    type: SET_ERROR,
    payload: error,
  };
};

export const filterBeforeResultFlag = () => {
  return {
    type: FILTER_BEFORE_RESULTS,
  };
};
