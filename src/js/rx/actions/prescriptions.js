export function loadRx(id) {
  if (id) {
    // TODO: Use id param instead of test id
    // when API is able to retrieve any individual Rx.
    const testId = 1435525;
    const rxUrl = `/rx-api/prescriptions/${testId}`; const rxUrls = [rxUrl, `${rxUrl}/trackings`];

    // Fetch both the prescription and its tracking history and
    // wait for retrieval and read of both resources to resolve.
    return dispatch => {
      Promise.all(
        rxUrls.map(url => fetch(url).then(res => res.json()))
      ).then(
        data => dispatch({
          type: 'LOAD_RX_SUCCESS',
          data: { rx: data[0].data, trackings: data[1].data }
        }),
        err => dispatch({ type: 'LOAD_RX_FAILURE', err })
      );
    };
  }

  return dispatch => dispatch({ type: 'LOAD_RX_FAILURE' });
}

export function loadAllRx(options) {
  let uri = '/rx-api/prescriptions';

  if (options) {
    if (options.sort) {
      uri = `${uri}?sort=${options.sort}`;
    }
    if (options.page) {
      // Handle pagination here...
    }
  }

  return dispatch => fetch(uri)
    .then(res => res.json())
    .then(
      data => dispatch({ type: 'LOAD_ALL_RX_SUCCESS', data }),
      err => dispatch({ type: 'LOAD_ALL_RX_FAILURE', err })
    );
}

export function loadActiveRx() {
  return dispatch => fetch('/rx-api/prescriptions/active')
    .then(res => res.json())
    .then(
      data => dispatch({ type: 'LOAD_ACTIVE_RX_SUCCESS', data }),
      err => dispatch({ type: 'LOAD_ACTIVE_RX_FAILURE', err })
    );
}
