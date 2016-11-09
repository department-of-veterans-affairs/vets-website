import assign from 'lodash/fp/assign';

import { api } from '../config';

export function loadPrescription(id) {
  if (id) {
    const rxUrl = `${api.url}/${id}`;
    const rxUrls = [rxUrl, `${rxUrl}/trackings`];

    // Fetch both the prescription and its tracking history and
    // wait for retrieval and read of both resources to resolve.
    return dispatch => {
      dispatch({ type: 'LOADING_DETAIL' });

      Promise.all(rxUrls.map(url => {
        return fetch(url, api.settings).then(response => {
          if (!response.ok) {
            return Promise.reject();
          }

          return response.json();
        });
      })).then(
        data => dispatch({
          type: 'LOAD_PRESCRIPTION_SUCCESS',
          data: { rx: data[0].data, trackings: data[1].data }
        }),
        error => dispatch({ type: 'LOAD_PRESCRIPTION_FAILURE', error })
      );
    };
  }

  return dispatch => dispatch({ type: 'LOAD_PRESCRIPTION_FAILURE' });
}

export function loadPrescriptions(options) {
  let url = api.url;
  let defaultSort = '-refill_submit_date';
  const queries = [];

  // Construct segments of the final URL based on options passed in.
  if (options) {
    if (options.active) {
      url = `${url}/active`;
      defaultSort = 'prescription_name';
    }

    if (options.page) {
      queries.push(`page=${options.page}`);
    }
  }

  queries.push(`sort=${options.sort || defaultSort}`);

  // Append query parameters.
  if (queries.length > 0) {
    const queryString = queries.join('&');
    url = `${url}?${queryString}`;
  }

  return dispatch => {
    dispatch({
      type: options.active ? 'LOADING_ACTIVE' : 'LOADING_HISTORY'
    });

    fetch(url, api.settings)
      .then(response => {
        if (!response.ok) {
          return Promise.reject();
        }

        return response.json();
      }).then(
        data => dispatch({
          type: 'LOAD_PRESCRIPTIONS_SUCCESS',
          active: options.active,
          data
        }),
        error => dispatch({
          type: 'LOAD_PRESCRIPTIONS_FAILURE',
          active: options.active,
          error
        })
      );
  };
}

export function refillPrescription(id) {
  if (id) {
    const url = `${api.url}/${id}/refill`;
    const settings = assign(api.settings, { method: 'PATCH' });

    return dispatch => fetch(url, settings)
      .then(
        data => dispatch({ type: 'REFILL_SUCCESS', id, data }),
        err => dispatch({ type: 'REFILL_FAILURE', err })
      );
  }

  return dispatch => dispatch({ type: 'REFILL_FAILURE' });
}

export function sortPrescriptions(sort) {
  return { type: 'SORT_PRESCRIPTIONS', sort };
}
