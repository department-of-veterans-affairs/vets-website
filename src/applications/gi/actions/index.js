import _, { snakeCase } from 'lodash';

import recordEvent from '../../../platform/monitoring/record-event';
import { api } from '../config';

export const UPDATE_ROUTE = 'UPDATE_ROUTE';
export const BENEFICIARY_ZIP_CODE_CHANGED = 'BENEFICIARY_ZIP_CODE_CHANGED';
export const DISPLAY_MODAL = 'DISPLAY_MODAL';
export const SET_PAGE_TITLE = 'SET_PAGE_TITLE';
export const ENTER_PREVIEW_MODE = 'ENTER_PREVIEW_MODE';
export const EXIT_PREVIEW_MODE = 'EXIT_PREVIEW_MODE';
export const SET_VERSION = 'SET_VERSION';
export const FETCH_CONSTANTS_STARTED = 'FETCH_CONSTANTS_STARTED';
export const FETCH_CONSTANTS_FAILED = 'FETCH_CONSTANTS_FAILED';
export const FETCH_CONSTANTS_SUCCEEDED = 'FETCH_CONSTANTS_SUCCEEDED';
export const AUTOCOMPLETE_STARTED = 'AUTOCOMPLETE_STARTED';
export const AUTOCOMPLETE_FAILED = 'AUTOCOMPLETE_FAILED';
export const AUTOCOMPLETE_SUCCEEDED = 'AUTOCOMPLETE_SUCCEEDED';
export const AUTOCOMPLETE_CLEARED = 'AUTOCOMPLETE_CLEARED';
export const AUTOCOMPLETE_TERM_CHANGED = 'AUTOCOMPLETE_TERM_CHANGED';
export const ELIGIBILITY_CHANGED = 'ELIGIBILITY_CHANGED';
export const SEARCH_STARTED = 'SEARCH_STARTED';
export const SEARCH_FAILED = 'SEARCH_FAILED';
export const SEARCH_SUCCEEDED = 'SEARCH_SUCCEEDED';
export const FETCH_BAH_STARTED = 'FETCH_BAH_STARTED';
export const FETCH_BAH_FAILED = 'FETCH_BAH_FAILED';
export const FETCH_BAH_SUCCEEDED = 'FETCH_BAH_SUCCEEDED';
export const FETCH_PROFILE_STARTED = 'FETCH_PROFILE_STARTED';
export const FETCH_PROFILE_FAILED = 'FETCH_PROFILE_FAILED';
export const FETCH_PROFILE_SUCCEEDED = 'FETCH_PROFILE_SUCCEEDED';
export const INSTITUTION_FILTER_CHANGED = 'INSTITUTION_FILTER_CHANGED';
export const CALCULATOR_INPUTS_CHANGED = 'CALCULATOR_INPUTS_CHANGED';
export const FILTER_TOGGLED = 'FILTER_TOGGLED';

export function updateRoute(location) {
  return { type: UPDATE_ROUTE, location };
}

export function showModal(modal) {
  if (modal) {
    recordEvent({
      event: 'gibct-learn-more',
      'gibct-modal-displayed': modal,
    });
  }
  return {
    type: DISPLAY_MODAL,
    modal,
  };
}

export function hideModal() {
  return showModal(null);
}

export function setPageTitle(title) {
  return {
    type: SET_PAGE_TITLE,
    title,
  };
}

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

export function fetchConstants(version) {
  const queryString = version ? `?version=${version}` : '';
  const url = `${api.url}/calculator_constants${queryString}`;

  return dispatch => {
    dispatch({ type: FETCH_CONSTANTS_STARTED });

    return fetch(url, api.settings)
      .then(res => res.json())
      .then(
        payload =>
          withPreview(dispatch, { type: FETCH_CONSTANTS_SUCCEEDED, payload }),
        err => dispatch({ type: FETCH_CONSTANTS_FAILED, err }),
      );
  };
}

export function updateAutocompleteSearchTerm(searchTerm) {
  return {
    type: AUTOCOMPLETE_TERM_CHANGED,
    searchTerm,
  };
}

export function fetchAutocompleteSuggestions(text, version) {
  const queryString = [`term=${text}`, version ? `version=${version}` : '']
    .filter(q => q)
    .join('&');

  const url = `${api.url}/institutions/autocomplete?${queryString}`;

  return dispatch =>
    fetch(url, api.settings)
      .then(res => res.json())
      .then(
        payload => dispatch({ type: AUTOCOMPLETE_SUCCEEDED, payload }),
        err => dispatch({ type: AUTOCOMPLETE_FAILED, err }),
      );
}

export function clearAutocompleteSuggestions() {
  return { type: AUTOCOMPLETE_CLEARED };
}

export function eligibilityChange(e) {
  const field = e.target.name;
  const value = e.target.value;
  recordEvent({
    event: 'gibct-form-change',
    'gibct-form-field': field,
    'gibct-form-value': value,
  });
  return {
    type: ELIGIBILITY_CHANGED,
    field,
    value,
  };
}

export function institutionFilterChange(filter) {
  return { type: INSTITUTION_FILTER_CHANGED, filter };
}

export function fetchSearchResults(query = {}) {
  const queryString = Object.keys(query).reduce((str, key) => {
    const sep = str ? '&' : '';
    return `${str}${sep}${snakeCase(key)}=${query[key]}`;
  }, '');

  const url = `${api.url}/institutions/search?${queryString}`;

  return dispatch => {
    dispatch({ type: SEARCH_STARTED, name: query.name || '' });

    return fetch(url, api.settings)
      .then(res => res.json())
      .then(
        payload => withPreview(dispatch, { type: SEARCH_SUCCEEDED, payload }),
        err => dispatch({ type: SEARCH_FAILED, err }),
      );
  };
}

export function fetchProfile(facilityCode, version) {
  const queryString = version ? `?version=${version}` : '';
  const url = `${api.url}/institutions/${facilityCode}${queryString}`;

  return dispatch => {
    dispatch({ type: FETCH_PROFILE_STARTED });

    return fetch(url, api.settings)
      .then(res => {
        if (res.ok) {
          return res.json();
        }

        return res.json().then(errors => {
          throw new Error(errors);
        });
      })
      .then(payload => {
        const institutionZIP = _.get(payload, 'data.attributes.zip');
        const bahUrl = `${api.url}/zipcode_rates/${institutionZIP}`;

        return (
          fetch(bahUrl, api.settings)
            .then(res => res.json())
            // if there's an error from the zipRatesPayload the reducer will just use the values from the institution end point.
            .then(zipRatesPayload => {
              withPreview(dispatch, {
                type: FETCH_PROFILE_SUCCEEDED,
                payload,
                zipRatesPayload,
              });
            })
        );
      })
      .catch(err => {
        dispatch({ type: FETCH_PROFILE_FAILED, err });
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

export function toggleFilter() {
  return { type: FILTER_TOGGLED };
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
