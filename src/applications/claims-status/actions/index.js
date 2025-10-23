import React from 'react';
import * as Sentry from '@sentry/browser';

import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/exports';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import localStorage from 'platform/utilities/storage/localStorage';

import { getErrorStatus, UNKNOWN_STATUS } from '../utils/appeals-v2-helpers';
import {
  makeAuthRequest,
  roundToNearest,
  buildDateFormatter,
  getUploadErrorMessage,
} from '../utils/helpers';
import { setPageFocus } from '../utils/page';
import { mockApi } from '../tests/e2e/fixtures/mocks/mock-api';
import manifest from '../manifest.json';
import { canUseMocks, ANCHOR_LINKS } from '../constants';
import {
  BACKEND_SERVICE_ERROR,
  CANCEL_UPLOAD,
  CLEAR_ADDITIONAL_EVIDENCE_NOTIFICATION,
  CLEAR_CLAIM_DETAIL,
  CLEAR_NOTIFICATION,
  DONE_UPLOADING,
  FETCH_APPEALS_ERROR,
  FETCH_APPEALS_PENDING,
  FETCH_APPEALS_SUCCESS,
  FETCH_CLAIMS_ERROR,
  FETCH_CLAIMS_PENDING,
  FETCH_CLAIMS_SUCCESS,
  FETCH_STEM_CLAIMS_ERROR,
  FETCH_STEM_CLAIMS_PENDING,
  FETCH_STEM_CLAIMS_SUCCESS,
  FETCH_FAILED_UPLOADS_ERROR,
  FETCH_FAILED_UPLOADS_PENDING,
  FETCH_FAILED_UPLOADS_SUCCESS,
  GET_CLAIM_DETAIL,
  RECORD_NOT_FOUND_ERROR,
  RESET_UPLOADS,
  SET_ADDITIONAL_EVIDENCE_NOTIFICATION,
  SET_CLAIM_DETAIL,
  SET_CLAIMS_UNAVAILABLE,
  SET_DECISION_REQUEST_ERROR,
  SET_DECISION_REQUESTED,
  SET_LAST_PAGE,
  SET_NOTIFICATION,
  SET_PROGRESS,
  SET_UNAUTHORIZED,
  SET_UPLOAD_ERROR,
  SET_UPLOADER,
  SET_UPLOADING,
  SUBMIT_DECISION_REQUEST,
  USER_FORBIDDEN_ERROR,
  VALIDATION_ERROR,
} from './types';

export const getClaimLetters = async () => {
  return apiRequest('/claim_letters');
};

export function setNotification(message) {
  return {
    type: SET_NOTIFICATION,
    message,
  };
}

export function setAdditionalEvidenceNotification(message) {
  return {
    type: SET_ADDITIONAL_EVIDENCE_NOTIFICATION,
    message,
  };
}

function fetchAppealsSuccess(response) {
  const appeals = response.data;
  return {
    type: FETCH_APPEALS_SUCCESS,
    appeals,
  };
}

export function getAppealsV2() {
  return dispatch => {
    dispatch({ type: FETCH_APPEALS_PENDING });
    return apiRequest('/appeals')
      .then(appeals => dispatch(fetchAppealsSuccess(appeals)))
      .catch(error => {
        const status = getErrorStatus(error);
        const action = { type: '' };
        switch (status) {
          case '403':
            action.type = USER_FORBIDDEN_ERROR;
            break;
          case '404':
            action.type = RECORD_NOT_FOUND_ERROR;
            break;
          case '422':
            action.type = VALIDATION_ERROR;
            break;
          case '502':
            action.type = BACKEND_SERVICE_ERROR;
            break;
          default:
            action.type = FETCH_APPEALS_ERROR;
            break;
        }
        Sentry.withScope(scope => {
          scope.setFingerprint(['{{default}}', status]);
          Sentry.captureException(`vets_appeals_v2_err_get_appeals ${status}`);
        });
        return dispatch(action);
      });
  };
}

function fetchClaimsSuccess(claims) {
  return {
    type: FETCH_CLAIMS_SUCCESS,
    claims,
  };
}

const recordClaimsAPIEvent = ({ startTime, success, error }) => {
  const event = {
    event: 'api_call',
    'api-name': 'GET claims',
    'api-status': success ? 'successful' : 'failed',
  };
  if (error) {
    event['error-key'] = error;
  }
  if (startTime) {
    const apiLatencyMs = roundToNearest({
      interval: 5000,
      value: Date.now() - startTime,
    });
    event['api-latency-ms'] = apiLatencyMs;
  }

  // There is a difference between the way that custom dimensions
  // and metrics are dealt with in UA (Universal Analytics) vs in
  // GA4. In UA, we push keys with dashes ('-') but in GA4 the object
  // keys must be delimited with ('_'). So we should just include
  // both versions for the applicable keys
  Object.keys(event).forEach(key => {
    if (key.includes('-')) {
      const newKey = key.replace(/-/g, '_');
      event[newKey] = event[key];
    }
  });

  recordEvent(event);
  if (event['error-key']) {
    recordEvent({
      'error-key': undefined,
    });
  }
};

export const getClaims = () => {
  return dispatch => {
    const startTimeMillis = Date.now();
    dispatch({ type: FETCH_CLAIMS_PENDING });

    return apiRequest('/benefits_claims')
      .then(res => {
        recordClaimsAPIEvent({
          startTime: startTimeMillis,
          success: true,
        });

        dispatch(fetchClaimsSuccess(res.data));
      })
      .catch(error => {
        const errorCode = getErrorStatus(error);
        if (errorCode && errorCode !== UNKNOWN_STATUS) {
          Sentry.withScope(scope => {
            scope.setFingerprint(['{{default}}', errorCode]);
            Sentry.captureException(
              `lighthouse_claims_err_get_claims ${errorCode}`,
            );
          });
        }

        // This onError callback will be called with a null response arg when
        // the API takes too long to return data
        const errorDetail =
          error === null ? '504 Timed out - API took too long' : errorCode;
        recordClaimsAPIEvent({
          startTime: startTimeMillis,
          success: false,
          error: errorDetail,
        });

        return dispatch({ type: FETCH_CLAIMS_ERROR });
      });
  };
};

export const getClaim = (id, navigate) => {
  return dispatch => {
    dispatch({ type: GET_CLAIM_DETAIL });

    return apiRequest(`/benefits_claims/${id}`)
      .then(res => {
        dispatch({
          type: SET_CLAIM_DETAIL,
          claim: res.data,
        });
      })
      .catch(error => {
        if (error.status !== 404 || !navigate) {
          return dispatch({
            type: SET_CLAIMS_UNAVAILABLE,
            error: error.message,
          });
        }

        return navigate('/your-claims', { replace: true });
      });
  };
};

export const clearClaim = () => ({ type: CLEAR_CLAIM_DETAIL });

export function submit5103(id, trackedItemId, cstClaimPhasesEnabled = false) {
  return dispatch => {
    dispatch({
      type: SUBMIT_DECISION_REQUEST,
    });

    const body = JSON.stringify({
      trackedItemId: Number(trackedItemId) || null,
    });

    makeAuthRequest(
      `/v0/benefits_claims/${id}/submit5103`,
      { method: 'POST', body },
      dispatch,
      () => {
        dispatch({ type: SET_DECISION_REQUESTED });
        if (cstClaimPhasesEnabled) {
          dispatch(
            setNotification({
              title: 'We received your evidence waiver',
              body:
                'Thank you. We’ll move your claim to the next step as soon as possible.',
            }),
          );
        } else {
          dispatch(
            setNotification({
              title: 'Request received',
              body:
                'Thank you. We have your claim request and will make a decision.',
            }),
          );
        }
      },
      error => {
        dispatch({ type: SET_DECISION_REQUEST_ERROR, error });
      },
    );
  };
}
export function resetUploads() {
  return {
    type: RESET_UPLOADS,
  };
}

function calcProgress(totalFiles, totalSize, filesComplete, bytesComplete) {
  const ratio = 0.8;

  return (
    (filesComplete / totalFiles) * (1 - ratio) +
    (bytesComplete / totalSize) * ratio
  );
}

export function clearNotification() {
  return {
    type: CLEAR_NOTIFICATION,
  };
}

export function clearAdditionalEvidenceNotification() {
  return {
    type: CLEAR_ADDITIONAL_EVIDENCE_NOTIFICATION,
  };
}

// Document upload function using Lighthouse endpoint
export function submitFiles(
  claimId,
  trackedItem,
  files,
  showDocumentUploadStatus = false,
) {
  let filesComplete = 0;
  let bytesComplete = 0;
  let hasError = false;
  const totalSize = files.reduce((sum, file) => sum + file.file.size, 0);
  const totalFiles = files.length;
  const trackedItemId = trackedItem ? trackedItem.id : null;

  recordEvent({
    event: 'claims-upload-start',
  });

  return dispatch => {
    dispatch(clearNotification());
    dispatch(clearAdditionalEvidenceNotification());
    dispatch({
      type: SET_UPLOADING,
      uploading: true,
    });
    dispatch({
      type: SET_PROGRESS,
      progress: 0,
    });
    require.ensure(
      [],
      require => {
        const csrfTokenStored = localStorage.getItem('csrfToken');
        const { FineUploaderBasic } = require('fine-uploader/lib/core');
        const uploader = new FineUploaderBasic({
          request: {
            endpoint: `${
              environment.API_URL
            }/v0/benefits_claims/${claimId}/benefits_documents`,
            inputName: 'file',
            customHeaders: {
              'Source-App-Name': manifest.entryName,
              'X-Key-Inflection': 'camel',
              'X-CSRF-Token': csrfTokenStored,
            },
          },
          cors: {
            expected: true,
            sendCredentials: true,
          },
          multiple: false,
          callbacks: {
            onAllComplete: () => {
              const now = new Date(Date.now());
              const uploadDate = buildDateFormatter()(now.toISOString());
              if (!hasError) {
                recordEvent({
                  event: 'claims-upload-success',
                });
                dispatch({
                  type: DONE_UPLOADING,
                });

                // Show different notification based on feature toggle
                const notificationMessage = showDocumentUploadStatus
                  ? {
                      title: `Document submission started on ${uploadDate}`,
                      body: (
                        <>
                          <span>
                            Your submission is in progress. It can take up to 2
                            days for us to receive your files.
                          </span>
                          <va-link
                            class="vads-u-display--block"
                            href={`#${ANCHOR_LINKS.fileSubmissionsInProgress}`}
                            text="Check the status of your submission"
                            onClick={e => {
                              e.preventDefault();
                              setPageFocus(e.target.href);
                            }}
                          />
                        </>
                      ),
                    }
                  : {
                      title: `We received your file upload on ${uploadDate}`,
                      body: (
                        <span>
                          If your uploaded file doesn’t appear in the Documents
                          Filed section on this page, please try refreshing the
                          page.
                        </span>
                      ),
                    };

                dispatch(setNotification(notificationMessage));
              } else {
                recordEvent({
                  event: 'claims-upload-failure',
                });
                dispatch({
                  type: SET_UPLOAD_ERROR,
                });
                dispatch(
                  setAdditionalEvidenceNotification(
                    getUploadErrorMessage(hasError, claimId),
                  ),
                );
              }
            },
            onTotalProgress: bytes => {
              bytesComplete = bytes;
              dispatch({
                type: SET_PROGRESS,
                progress: calcProgress(
                  totalFiles,
                  totalSize,
                  filesComplete,
                  bytesComplete,
                ),
              });
            },
            onComplete: () => {
              filesComplete += 1;
              dispatch({
                type: SET_PROGRESS,
                progress: calcProgress(
                  totalFiles,
                  totalSize,
                  filesComplete,
                  bytesComplete,
                ),
              });
            },
            onError: (_id, fileName, _reason, { response, status }) => {
              if (status === 401) {
                dispatch({
                  type: SET_UNAUTHORIZED,
                });
              }
              if (status < 200 || status > 299) {
                hasError = JSON.parse(response || '{}');
                hasError.fileName = fileName;
              }
            },
          },
        });
        dispatch({
          type: SET_UPLOADER,
          uploader,
        });
        dispatch({
          type: SET_PROGRESS,
          progress: filesComplete / files.length,
        });

        /* eslint-disable camelcase */
        files.forEach(({ file, docType, password }) => {
          uploader.addFiles(file, {
            tracked_item_ids: JSON.stringify([trackedItemId]),
            document_type: docType.value,
            password: password.value,
          });
        });
        /* eslint-enable camelcase */
      },
      'claims-uploader',
    );
  };
}

// Add some attributes to the STEM claim to help normalize it's shape
const addAttributes = claim => ({
  ...claim,
  attributes: {
    ...claim.attributes,
    claimType: 'STEM',
    phaseChangeDate: claim.attributes.submittedAt,
  },
});

// We don't want to show STEM claims unless they were automatically denied
const automatedDenial = stemClaim => stemClaim.attributes.automatedDenial;

const getStemClaimsMock = dispatch => {
  return mockApi.getStemClaimList().then(res => {
    const stemClaims = res.data.map(addAttributes).filter(automatedDenial);

    return dispatch({
      type: FETCH_STEM_CLAIMS_SUCCESS,
      stemClaims,
    });
  });
};

export function getStemClaims() {
  return dispatch => {
    dispatch({ type: FETCH_STEM_CLAIMS_PENDING });

    if (canUseMocks()) {
      return getStemClaimsMock(dispatch);
    }

    return makeAuthRequest(
      '/v0/education_benefits_claims/stem_claim_status',
      null,
      dispatch,
      res => {
        const stemClaims = res.data.map(addAttributes).filter(automatedDenial);
        dispatch({
          type: FETCH_STEM_CLAIMS_SUCCESS,
          stemClaims,
        });
      },
      () => dispatch({ type: FETCH_STEM_CLAIMS_ERROR }),
    );
  };
}

export function cancelUpload() {
  return (dispatch, getState) => {
    const { uploader } = getState().disability.status.uploads;
    recordEvent({
      event: 'claims-upload-cancel',
    });

    if (uploader) {
      uploader.cancelAll();
    }

    dispatch({
      type: CANCEL_UPLOAD,
    });
  };
}

export function setLastPage(page) {
  return {
    type: SET_LAST_PAGE,
    page,
  };
}

export function fetchFailedUploads() {
  return async dispatch => {
    dispatch({ type: FETCH_FAILED_UPLOADS_PENDING });

    try {
      const response = await apiRequest(
        '/benefits_claims/failed_upload_evidence_submissions',
      );
      dispatch({
        type: FETCH_FAILED_UPLOADS_SUCCESS,
        data: response.data,
      });
    } catch (error) {
      dispatch({
        type: FETCH_FAILED_UPLOADS_ERROR,
        error: error.message || 'Failed to fetch failed uploads',
      });
    }
  };
}
