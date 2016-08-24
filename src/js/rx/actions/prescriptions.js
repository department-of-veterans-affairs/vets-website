export function loadData(id) {
  if (id) {
    // TODO: Use id param instead of test id
    // when API is able to retrieve any individual Rx.
    const test_id = 1435525;
    return dispatch => fetch(`/api/prescriptions/${test_id}`)
      .then(res => res.json())
      .then(
        data => dispatch({ type: 'LOAD_PRESCRIPTION_SUCCESS', data }),
        err => dispatch({ type: 'LOAD_PRESCRIPTION_FAILURE', err })
      );
  }

  return dispatch => fetch('/api/prescriptions')
    .then(res => res.json())
    .then(
      data => dispatch({ type: 'LOAD_PRESCRIPTIONS_SUCCESS', data }),
      err => dispatch({ type: 'LOAD_PRESCRIPTIONS_FAILURE', err })
    );
}
