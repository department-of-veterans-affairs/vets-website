import environment from '../../common/helpers/environment';

export const SET_CLAIMS = 'SET_CLAIMS';
export const CHANGE_CLAIMS_PAGE = 'CHANGE_CLAIMS_PAGE';

export function getClaims() {
  return (dispatch) => {
    fetch(`${environment.API_URL}/v0/disability_claims`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'X-Key-Inflection': 'camel',
      }
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        }

        return Promise.reject(res.statusText);
      })
      .then(claims => dispatch({ type: 'SET_CLAIMS', claims: claims.data }));
  };
}

export function changePage(page) {
  return {
    type: CHANGE_CLAIMS_PAGE,
    page
  };
}
