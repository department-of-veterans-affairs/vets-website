export const SET_CLAIMS = 'SET_CLAIMS';
export const CHANGE_CLAIMS_PAGE = 'CHANGE_CLAIMS_PAGE';

// localhost needs to be replaced to make this api calls work in dev or staging
// http://localhost:3000/v0 -> /api/v0

export function getClaims() {
  return (dispatch) => {
    fetch('//localhost:3000/v0/disability_claims', {
      method: 'GET',
      mode: 'cors',
      headers: {
        'X-Key-Inflection': 'camel',
      }
    })
      .then(res => res.json())
      .then(claims => dispatch({ type: 'SET_CLAIMS', claims: claims.data }));
  };
}

export function changePage(page) {
  return {
    type: CHANGE_CLAIMS_PAGE,
    page
  };
}
