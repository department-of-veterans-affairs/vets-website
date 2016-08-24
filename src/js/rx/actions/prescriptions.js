export function loadData(id) {
  if (id) {
    // TODO: Use id param instead of hard-coded id
    // when API is able to retrieve any individual Rx.
    return dispatch => fetch(`/api/prescriptions/1435525`)
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
