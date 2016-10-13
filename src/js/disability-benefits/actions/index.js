import environment from '../../common/helpers/environment';

export const SET_CLAIMS = 'SET_CLAIMS';
export const CHANGE_CLAIMS_PAGE = 'CHANGE_CLAIMS_PAGE';
export const GET_CLAIM_DETAIL = 'GET_CLAIM_DETAIL';
export const SET_CLAIM_DETAIL = 'SET_CLAIM_DETAIL';
export const SUBMIT_DECISION_REQUEST = 'SUBMIT_DECISION_REQUEST';
export const SET_DECISION_REQUESTED = 'SET_DECISION_REQUESTED';
export const SET_DECISION_REQUEST_ERROR = 'SET_DECISION_REQUEST_ERROR';

export function getClaims() {
  return (dispatch) => {
    fetch(`${environment.API_URL}/v0/disability_claims`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'X-Key-Inflection': 'camel',
        Authorization: `Token token=${localStorage.userToken}`
      }
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        }

        return Promise.reject(res.statusText);
      })
      .then(claims => dispatch({ type: SET_CLAIMS, claims: claims.data }));
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
        Authorization: `Token token=${localStorage.userToken}`
      }
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        }

        return Promise.reject(res.statusText);
      })
      .then(resp => dispatch({ type: SET_CLAIM_DETAIL, claim: resp.data }));
  };
}

export function submitRequest(id) {
  return (dispatch) => {
    dispatch({
      type: SUBMIT_DECISION_REQUEST
    });
    fetch(`${environment.API_URL}/v0/disability_claims/${id}/request_decision`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'X-Key-Inflection': 'camel',
      }
    })
      .then(res => {
        if (!res.ok) {
          return Promise.reject(res.statusText);
        }

        return Promise.resolve();
      })
      .then(() => dispatch({ type: SET_DECISION_REQUESTED }))
      .catch(error => dispatch({ type: SET_DECISION_REQUEST_ERROR, error }));
  };
}
