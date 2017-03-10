import environment from '../../common/helpers/environment';
import { makeAuthRequest } from '../utils/helpers';

export const SET_CLAIMS = 'SET_CLAIMS';
export const FILTER_CLAIMS = 'FILTER_CLAIMS';
export const SORT_CLAIMS = 'SORT_CLAIMS';
export const CHANGE_CLAIMS_PAGE = 'CHANGE_CLAIMS_PAGE';
export const GET_CLAIM_DETAIL = 'GET_CLAIM_DETAIL';
export const SET_CLAIM_DETAIL = 'SET_CLAIM_DETAIL';
export const SUBMIT_DECISION_REQUEST = 'SUBMIT_DECISION_REQUEST';
export const SET_DECISION_REQUESTED = 'SET_DECISION_REQUESTED';
export const SET_DECISION_REQUEST_ERROR = 'SET_DECISION_REQUEST_ERROR';
export const SET_UNAVAILABLE = 'SET_UNAVAILABLE';
export const SET_UNAUTHORIZED = 'SET_UNAUTHORIZED';
export const RESET_UPLOADS = 'RESET_UPLOADS';
export const ADD_FILE = 'ADD_FILE';
export const REMOVE_FILE = 'REMOVE_FILE';
export const SUBMIT_FILES = 'SUBMIT_FILES';
export const SET_UPLOADING = 'SET_UPLOADING';
export const SET_UPLOADER = 'SET_UPLOADER';
export const DONE_UPLOADING = 'DONE_UPLOADING';
export const SET_PROGRESS = 'SET_PROGRESS';
export const SET_UPLOAD_ERROR = 'SET_UPLOAD_ERROR';
export const UPDATE_FIELD = 'UPDATE_FIELD';
export const SHOW_MAIL_OR_FAX = 'SHOW_MAIL_OR_FAX';
export const CANCEL_UPLOAD = 'CANCEL_UPLOAD';
export const SET_FIELDS_DIRTY = 'SET_FIELD_DIRTY';
export const SHOW_CONSOLIDATED_MODAL = 'SHOW_CONSOLIDATED_MODAL';
export const SET_LAST_PAGE = 'SET_LAST_PAGE';
export const SET_NOTIFICATION = 'SET_NOTIFICATION';
export const CLEAR_NOTIFICATION = 'CLEAR_NOTIFICATION';
export const HIDE_30_DAY_NOTICE = 'HIDE_30_DAY_NOTICE';

export function setNotification(message) {
  return {
    type: SET_NOTIFICATION,
    message
  };
}

export function getClaims(filter) {
  return (dispatch) => {
    makeAuthRequest('/v0/evss_claims',
      null,
      dispatch,
      claims => {
        dispatch({ type: SET_CLAIMS, filter, claims: claims.data, meta: claims.meta });
      },
      () => dispatch({ type: SET_UNAVAILABLE })
    );
  };
}

export function filterClaims(filter) {
  return {
    type: FILTER_CLAIMS,
    filter
  };
}

export function sortClaims(sortProperty) {
  return {
    type: SORT_CLAIMS,
    sortProperty
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

export function getClaimDetail(id, router) {
  return (dispatch) => {
    dispatch({
      type: GET_CLAIM_DETAIL
    });
    makeAuthRequest(`/v0/evss_claims/${id}`,
      null,
      dispatch,
      resp => dispatch({ type: SET_CLAIM_DETAIL, claim: resp.data, meta: resp.meta }),
      resp => {
        if (resp.status !== 404 || !router) {
          dispatch({ type: SET_UNAVAILABLE });
        } else {
          router.replace('your-claims');
        }
      }
    );
  };
}

export function submitRequest(id) {
  return (dispatch) => {
    dispatch({
      type: SUBMIT_DECISION_REQUEST
    });
    makeAuthRequest(`/v0/evss_claims/${id}/request_decision`,
      { method: 'POST' },
      dispatch,
      () => {
        dispatch({ type: SET_DECISION_REQUESTED });
        dispatch(setNotification({
          title: 'Request received',
          body: 'Thank you. We have your claim request and will make a decision.'
        }));
      },
      error => {
        dispatch({ type: SET_DECISION_REQUEST_ERROR, error });
      }
    );
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

export function clearNotification() {
  return {
    type: CLEAR_NOTIFICATION
  };
}

export function submitFiles(claimId, trackedItem, files) {
  let filesComplete = 0;
  let bytesComplete = 0;
  let hasError = false;
  const totalSize = files.reduce((sum, file) => sum + file.file.size, 0);
  const totalFiles = files.length;
  const trackedItemId = trackedItem ? trackedItem.trackedItemId : null;
  window.dataLayer.push({
    event: 'claims-upload-start',
  });

  return (dispatch) => {
    dispatch(clearNotification());
    dispatch({
      type: SET_UPLOADING,
      uploading: true,
    });
    dispatch({
      type: SET_PROGRESS,
      progress: 0
    });
    require.ensure([], (require) => {
      const { FineUploaderBasic } = require('fine-uploader/lib/core');
      const uploader = new FineUploaderBasic({
        request: {
          endpoint: `${environment.API_URL}/v0/evss_claims/${claimId}/documents`,
          inputName: 'file',
          customHeaders: {
            'X-Key-Inflection': 'camel',
            Authorization: `Token token=${sessionStorage.userToken}`
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
              window.dataLayer.push({
                event: 'claims-upload-success',
              });
              dispatch({
                type: DONE_UPLOADING,
              });
              dispatch(setNotification({
                title: 'We have your evidence',
                body: `Thank you for filing ${trackedItem ? trackedItem.displayName : 'additional evidence'}. We'll let you know when we've reviewed it.`
              }));
            } else {
              window.dataLayer.push({
                event: 'claims-upload-failure',
              });
              dispatch({
                type: SET_UPLOAD_ERROR
              });
              dispatch(setNotification({
                title: 'Error uploading files',
                body: 'There was an error uploading your files. Please try again',
                type: 'error'
              }));
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
            const errorCode = reason.substr(-3);
            // this is a little hackish, but uploader expects a json response
            if (!errorCode.startsWith('2')) {
              hasError = true;
            }
            if (errorCode === '401') {
              dispatch({
                type: SET_UNAUTHORIZED
              });
            }
          }
        }
      });
      dispatch({
        type: SET_UPLOADER,
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
    }, 'claims-uploader');
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
    window.dataLayer.push({
      event: 'claims-upload-cancel',
    });

    if (uploader) {
      uploader.cancelAll();
    }

    dispatch({
      type: CANCEL_UPLOAD
    });
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

export function hide30DayNotice() {
  return {
    type: HIDE_30_DAY_NOTICE
  };
}
