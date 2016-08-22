export function loadData() {
  return dispatch => fetch('/api/profile')
    .then(res => res.json())
    .then(
      data => dispatch({ type: 'LOAD_PROFILE_SUCCESS', data }),
      err => dispatch({ type: 'LOAD_PROFILE_FAILURE', err })
    );
}
