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
      .then(resp => dispatch({ type: SET_CLAIM_DETAIL, claim: resp.data }))
      .catch(() => dispatch({ type: SET_UNAVAILABLE }));
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
    } else {
      dispatch({
        type: SET_UNAVAILABLE
      });
    }
  };
}

export function addFile(file) {
  return {
    type: ADD_FILE,
    file
  };
}

export function removeFile(index) {
  return {
    type: REMOVE_FILE,
    index
  };
}

export function submitFiles(claimId, trackedItemId, files) {
  const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
  return (dispatch, getState) => {
    dispatch({
      type: SET_UPLOADING,
      uploading: true
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
          if (!getState().trackedItem.uploads.uploadError) {
            dispatch({
              type: DONE_UPLOADING
            });
          }
        },
        onTotalProgress: (bytes) => {
          dispatch({
            type: SET_PROGRESS,
            progress: bytes / totalBytes
          });
        },
        onError: () => {
          dispatch({
            type: SET_UPLOAD_ERROR
          });
        }
      }
    });
    uploader.addFiles(files);
  };
}
