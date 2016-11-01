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
export const RESET_UPLOADS = 'RESET_UPLOADS';
export const ADD_FILE = 'ADD_FILE';
export const REMOVE_FILE = 'REMOVE_FILE';
export const SUBMIT_FILES = 'SUBMIT_FILES';
export const SET_UPLOADING = 'SET_UPLOADING';
export const DONE_UPLOADING = 'DONE_UPLOADING';
export const SET_PROGRESS = 'SET_PROGRESS';
export const SET_UPLOAD_ERROR = 'SET_UPLOAD_ERROR';
export const UPDATE_FIELD = 'UPDATE_FIELD';
export const SHOW_MAIL_OR_FAX = 'SHOW_MAIL_OR_FAX';
export const CANCEL_UPLOAD = 'CANCEL_UPLOAD';
export const CLEAR_UPLOADED_ITEM = 'CLEAR_UPLOADED_ITEM';
export const SET_FIELDS_DIRTY = 'SET_FIELD_DIRTY';
export const SHOW_CONSOLIDATED_MODAL = 'SHOW_CONSOLIDATED_MODAL';
export const SET_LAST_PAGE = 'SET_LAST_PAGE';

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

export function resetUploads() {
  return {
    type: RESET_UPLOADS
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

function calcProgress(totalFiles, totalSize, filesComplete, bytesComplete) {
  const ratio = 0.8;

  return ((filesComplete / totalFiles) * (1 - ratio)) + ((bytesComplete / totalSize) * ratio);
}

export function submitFiles(claimId, trackedItem, files) {
  let filesComplete = 0;
  let bytesComplete = 0;
  let hasError = false;
  const totalSize = files.reduce((sum, file) => sum + file.file.size, 0);
  const totalFiles = files.length;
  const trackedItemId = trackedItem ? trackedItem.trackedItemId : null;

  return (dispatch) => {
    const uploader = new FineUploaderBasic({
      request: {
        endpoint: `${environment.API_URL}/v0/disability_claims/${claimId}/documents`,
        inputName: 'file',
        customHeaders: {
          'X-Key-Inflection': 'camel',
          Authorization: `Token token=${localStorage.userToken}`
        }
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
              type: DONE_UPLOADING,
              itemName: trackedItem ? trackedItem.displayName : null
            });
          } else {
            dispatch({
              type: SET_UPLOAD_ERROR
            });
          }
        },
        onTotalProgress: (bytes) => {
          bytesComplete = bytes;
          dispatch({
            type: SET_PROGRESS,
            progress: calcProgress(totalFiles, totalSize, filesComplete, bytesComplete)
          });
        },
        onComplete: () => {
          filesComplete++;
          dispatch({
            type: SET_PROGRESS,
            progress: calcProgress(totalFiles, totalSize, filesComplete, bytesComplete)
          });
        },
        onError: (id, name, reason) => {
          if (!reason.endsWith('204')) {
            hasError = true;
          }
        }
      }
    });
    dispatch({
      type: SET_UPLOADING,
      uploading: true,
      uploader
    });
    dispatch({
      type: SET_PROGRESS,
      progress: filesComplete / files.length
    });

    /* eslint-disable camelcase */
    files.forEach(({ file, docType }) => {
      uploader.addFiles(file, {
        tracked_item_id: trackedItemId,
        document_type: docType.value
      });
    });
    /* eslint-enable camelcase */
  };
}

export function updateField(path, field) {
  return {
    type: UPDATE_FIELD,
    path,
    field
  };
}

export function showMailOrFaxModal(visible) {
  return {
    type: SHOW_MAIL_OR_FAX,
    visible
  };
}

export function cancelUpload() {
  return (dispatch, getState) => {
    const uploader = getState().uploads.uploader;

    if (uploader) {
      uploader.cancelAll();
    }

    dispatch({
      type: CANCEL_UPLOAD
    });
  };
}

export function clearUploadedItem() {
  return {
    type: CLEAR_UPLOADED_ITEM
  };
}

export function setFieldsDirty() {
  return {
    type: SET_FIELDS_DIRTY
  };
}

export function showConsolidatedMessage(visible) {
  return {
    type: SHOW_CONSOLIDATED_MODAL,
    visible
  };
}

export function setLastPage(page) {
  return {
    type: SET_LAST_PAGE,
    page
  };
}
