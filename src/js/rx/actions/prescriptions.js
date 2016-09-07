import _ from 'lodash';

export function loadPrescription(id) {
  if (id) {
    // TODO: Use id param instead of test id
    // when API is able to retrieve any individual Rx.
    const rxUrl = `/rx-api/prescriptions/${id}`;
    const rxUrls = [rxUrl, `${rxUrl}/trackings`];

    // Fetch both the prescription and its tracking history and
    // wait for retrieval and read of both resources to resolve.
    return dispatch => {
      Promise.all(
        rxUrls.map(url => fetch(url, {
          headers: {
            'X-Key-Inflection': 'dash'
          }
        }).then(res => res.json()))
      ).then(
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
  let uri = '/rx-api/prescriptions';
  const queries = [];

  // Construct segments of the final URI based on options passed in.
  if (options) {
    // Fetching active prescriptions only.
    if (options.active) {
      uri = `${uri}/active`;
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

  // Append query parameters to the base URI.
  if (queries.length > 0) {
    const queryString = queries.join('&');
    uri = `${uri}?${queryString}`;
  }

  return dispatch => fetch(uri, {
    headers: {
      'X-Key-Inflection': 'dash'
    }
  }).then(res => res.json())
    .then(
      data => dispatch({ type: 'LOAD_PRESCRIPTIONS_SUCCESS', data }),
      err => dispatch({ type: 'LOAD_PRESCRIPTIONS_FAILURE', err })
    );
}

export function refillPrescription(id) {
  if (id) {
    // TODO: Use id param instead of test id
    // when API is able to retrieve any individual Rx.
    const uri = `/rx-api/prescriptions/${id}/refill`;

    return dispatch => fetch(uri, {
      method: 'PATCH'
    }).then(
      data => dispatch({ type: 'REFILL_SUCCESS', id, data }),
      err => dispatch({ type: 'REFILL_FAILURE', err })
    );
  }

  return dispatch => dispatch({ type: 'REFILL_FAILURE' });
}
