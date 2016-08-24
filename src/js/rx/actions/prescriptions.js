const proxyUrl = 'https://dev.vets.gov/prescriptions-api/rx/v1/prescriptions';

export function loadData() {
	console.log(fetch);
  return dispatch => fetch(proxyUrl, {
			credentials: true,
		  headers: {
	 		  Authorization: 'Basic '+btoa('username:password') //TODO: credentials here
		  }, 
    })
    .then(res => res.json())
    .then(
      data => dispatch({ type: 'LOAD_PRESCRIPTIONS_SUCCESS', data }),
      err => dispatch({ type: 'LOAD_PRESCRIPTIONS_FAILURE', err })
    );
}
