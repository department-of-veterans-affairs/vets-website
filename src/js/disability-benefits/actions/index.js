export const SET_CLAIMS = 'SET_CLAIMS';

export function getClaims() {
  return (dispatch) => {
    // fetch('/api/v0/disability_claims', {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'X-Key-Inflection': 'camel'
    //   }
    // })
    //   .then(res => res.json())
    //   .then(
    //     claims => dispatch({ type: 'SET_CLAIMS', claims })
    //   );
    dispatch({
      type: SET_CLAIMS,
      claims: [{
        id: '1234',
        type: 'disability_claims',
        attributes: {
          dateFiled: '2016-06-01'
        }
      }]
    });
  };
}
