import environment from '../../common/helpers/environment';
import { FineUploaderBasic } from 'fine-uploader/lib/core';

export const SET_CLAIMS = 'SET_CLAIMS';
export const CHANGE_CLAIMS_PAGE = 'CHANGE_CLAIMS_PAGE';
export const GET_CLAIM_DETAIL = 'GET_CLAIM_DETAIL';
export const SET_CLAIM_DETAIL = 'SET_CLAIM_DETAIL';
export const SUBMIT_DECISION_REQUEST = 'SUBMIT_DECISION_REQUEST';
export const SET_DECISION_REQUESTED = 'SET_DECISION_REQUESTED';
export const SET_DECISION_REQUEST_ERROR = 'SET_DECISION_REQUEST_ERROR';
export const SET_UNAVAILABLE = 'SET_UNAVAILABLE';
export const SET_TRACKED_ITEM = 'SET_TRACKED_ITEM';
export const ADD_FILE = 'ADD_FILE';
export const REMOVE_FILE = 'REMOVE_FILE';
export const SUBMIT_FILES = 'SUBMIT_FILES';
export const SET_UPLOADING = 'SET_UPLOADING';
export const DONE_UPLOADING = 'DONE_UPLOADING';
export const SET_PROGRESS = 'SET_PROGRESS';
export const SET_UPLOAD_ERROR = 'SET_UPLOAD_ERROR';
export const UPDATE_FIELD = 'UPDATE_FIELD';
export const SHOW_MAIL_OR_FAX = 'SHOW_MAIL_OR_FAX';

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
      .then(claims => dispatch({ type: SET_CLAIMS, claims: claims.data }))
      .catch(() => dispatch({ type: SET_UNAVAILABLE }));
  };
}

export function changePage(page) {
  return {
    type: CHANGE_CLAIMS_PAGE,
    page
  };
}

export function setUnavailable() {
  return {
    type: SET_UNAVAILABLE
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
      .then(
        resp => dispatch({ type: SET_CLAIM_DETAIL, claim: resp.data }),
        () => dispatch({ type: SET_UNAVAILABLE })
      );
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
        Authorization: `Token token=${localStorage.userToken}`
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

export function getTrackedItem(id) {
  return (dispatch, getState) => {
    const item = getState()
      .claimDetail.detail.attributes.eventsTimeline
      .filter(event => event.trackedItemId === parseInt(id, 10))[0];

    if (item) {
      dispatch({
        type: SET_TRACKED_ITEM,
        item
      });
    }
  };
}

export function addFile(files) {
  return {
    type: ADD_FILE,
    files
  };
}

export function removeFile(index) {
  return {
    type: REMOVE_FILE,
    index
  };
}

export function submitFiles(claimId, trackedItemId, files) {
  let filesComplete = 0;
  let hasError = false;
  return (dispatch) => {
    dispatch({
      type: SET_UPLOADING,
      uploading: true
    });
    dispatch({
      type: SET_PROGRESS,
      progress: filesComplete / files.length
    });

    const uploader = new FineUploaderBasic({
      request: {
        endpoint: `${environment.API_URL}/v0/disability_claims/${claimId}/documents`,
        params: {
          trackedItemId
        },
        inputName: 'file'
      },
      cors: {
        expected: true,
        sendCredentials: true
      },
      multiple: false,
      callbacks: {
        onAllComplete: () => {
          if (!hasError) {
            dispatch({
              type: DONE_UPLOADING
            });
          } else {
            dispatch({
              type: SET_UPLOAD_ERROR
            });
          }
        },
        onComplete: () => {
          filesComplete++;
          dispatch({
            type: SET_PROGRESS,
            progress: filesComplete / files.length
          });
        },
        onError: () => {
          hasError = true;
        }
      }
    });
    uploader.addFiles(files);
  };
}

export function updateField(field) {
  return {
    type: UPDATE_FIELD,
    field
  };
}

export function showMailOrFaxModal(visible) {
  return {
    type: SHOW_MAIL_OR_FAX,
    visible
  };
}
