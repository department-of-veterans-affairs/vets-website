import _ from 'lodash';

import { api } from '../config';

export function loadPrescription(id) {
  if (id) {
    const rxUrl = `${api.url}/${id}`;
    const rxUrls = [rxUrl, `${rxUrl}/trackings`];

    // Fetch both the prescription and its tracking history and
    // wait for retrieval and read of both resources to resolve.
    return dispatch => {
      Promise.all(rxUrls.map(url => {
        return fetch(url, api.settings).then(res => res.json());
      })).then(
        data => dispatch({
          type: 'LOAD_PRESCRIPTION_SUCCESS',
          data: { rx: data[0].data, trackings: data[1].data }
        }),
        err => dispatch({ type: 'LOAD_PRESCRIPTION_FAILURE', err })
      );
    };
  }

  return dispatch => dispatch({ type: 'LOAD_PRESCRIPTION_FAILURE' });
}

export function loadPrescriptions(options) {
  let url = api.url;
  const queries = [];

  // Construct segments of the final URL based on options passed in.
  if (options) {
    // Fetching active prescriptions only.
    if (options.active) {
      url = `${url}/active`;
    }

    // Set the sort param. Convert it into a format that the API accepts.
    if (options.sort) {
      const formattedValue = _.snakeCase(options.sort.value);
      const sortParam = options.sort.order === 'DESC'
                      ? `-${formattedValue}`
                      : formattedValue;

      queries.push(`sort=${sortParam}`);
    }

    // Set the current page.
    if (options.page) {
      queries.push(`page=${options.page}`);
    }
  }

  // Append query parameters.
  if (queries.length > 0) {
    const queryString = queries.join('&');
    url = `${url}?${queryString}`;
  }

  return dispatch => fetch(url, api.settings)
    .then(res => res.json())
    .then(
      data => dispatch({ type: 'LOAD_PRESCRIPTIONS_SUCCESS', data }),
      err => dispatch({ type: 'LOAD_PRESCRIPTIONS_FAILURE', err })
    );
}

export function refillPrescription(id) {
  if (id) {
    const url = `${api.url}/${id}/refill`;

    return dispatch => fetch(url, {
      method: 'PATCH'
    }).then(
      data => dispatch({ type: 'REFILL_SUCCESS', id, data }),
      err => dispatch({ type: 'REFILL_FAILURE', err })
    );
  }

  return dispatch => dispatch({ type: 'REFILL_FAILURE' });
}
