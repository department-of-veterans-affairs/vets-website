import environment from '../../common/helpers/environment';

export const SET_CLAIMS = 'SET_CLAIMS';
export const CHANGE_CLAIMS_PAGE = 'CHANGE_CLAIMS_PAGE';
export const GET_CLAIM_DETAIL = 'GET_CLAIM_DETAIL';
export const SET_CLAIM_DETAIL = 'SET_CLAIM_DETAIL';

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

export function getClaimDetail(id) {
  return (dispatch) => {
    dispatch({
      type: GET_CLAIM_DETAIL
    });
    fetch(`${environment.API_URL}/v0/disability_claims/${id}`, {
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
      .then(resp => dispatch({ type: 'SET_CLAIM_DETAIL', claim: resp.data }));
  };
}
