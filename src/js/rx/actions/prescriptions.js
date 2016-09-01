// TODO(alexose): make configurable / overridable
const apiUrl = 'https://dev.vets.gov/api/rx/v1/prescriptions';

const options = {
  credentials: true,
  headers: {
    // TODO(alexose): actual credentials
    Authorization: `Basic ${btoa('username:password')}`
  }
};

export function loadData(id) {
  if (id) {
    // TODO: Use id param instead of test id
    // when API is able to retrieve any individual Rx.
    const testId = 1435525;
    const rxUrl = `${apiUrl}/${testId}`;
    const rxUrls = [rxUrl, `${rxUrl}/trackings`];

    // Fetch both the prescription and its tracking history and
    // wait for retrieval and read of both resources to resolve.
    return dispatch => {
      Promise.all(
        rxUrls.map(url => fetch(url, options).then(res => res.json()))
      ).then(
        data => dispatch({
          type: 'LOAD_PRESCRIPTION_SUCCESS',
          data: { rx: data[0].data, trackings: data[1].data }
        }),
        err => dispatch({ type: 'LOAD_PRESCRIPTION_FAILURE', err })
      );
    };
  }

  return dispatch => fetch(apiUrl, options)
    .then(res => res.json())
    .then(
      data => dispatch({ type: 'LOAD_PRESCRIPTIONS_SUCCESS', data }),
      err => dispatch({ type: 'LOAD_PRESCRIPTIONS_FAILURE', err })
    );
}
