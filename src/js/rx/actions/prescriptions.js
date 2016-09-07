export function loadPrescription(id) {
  if (id) {
    // TODO: Use id param instead of test id
    // when API is able to retrieve any individual Rx.
    const testId = 1435525;
    const rxUrl = `/rx-api/prescriptions/${testId}`;
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
    if (options.active) {
      uri = `${uri}/active`;
    }
    if (options.sort) {
      queries.push(`sort=${options.sort}`);
    }
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
