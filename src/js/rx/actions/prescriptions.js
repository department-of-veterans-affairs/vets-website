export function loadData(id = null) {
  if (id) {
    // TODO: Remove this line when API can retrieve any individual Rx.
    id = 1435525;
    return dispatch => fetch(`/api/prescriptions/${id}`)
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
