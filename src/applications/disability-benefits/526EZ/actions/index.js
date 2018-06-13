import { apiRequest } from '../../../../platform/utilities/api';
import Raven from 'raven-js';

import { getLatestTimestamp } from '../helpers';

export const PRESTART_STATUS_SET = 'PRESTART_STATUS_SET';
export const PRESTART_STATUS_RESET = 'PRESTART_STATUS_RESET';
export const PRESTART_DISPLAY_RESET = 'PRESTART_DISPLAY_RESET';

export const PRESTART_STATUSES = {
  notAttempted: 'not-attempted',
  active: 'active',
  pending: 'pending',
  none: 'none',
  expired: 'expired',
  created: 'created',
  retrieved: 'retrieved',
  renewed: 'renewed',
  notRetrievedSaved: 'not-retrieved-saved',
  notRetrievedNew: 'not-retrieved-new',
  notCreated: 'not-created',
  notRenewed: 'not-renewed',
};

export const prestartSuccessStatuses = new Set([PRESTART_STATUSES.created, PRESTART_STATUSES.retrieved, PRESTART_STATUSES.renewed]);

export const prestartFailureStatuses = new Set([PRESTART_STATUSES.notCreated, PRESTART_STATUSES.notRenewed, PRESTART_STATUSES.notRetrievedNew, PRESTART_STATUSES.notRetrievedSaved]);

export const prestartPendingStatuses = new Set([PRESTART_STATUSES.none, PRESTART_STATUSES.expired, PRESTART_STATUSES.pending]);

export function setPrestartStatus(status, data) {
  return {
    type: PRESTART_STATUS_SET,
    status,
    data
  };
}

export function resetPrestartStatus() {
  return {
    type: PRESTART_STATUS_RESET
  };
}

export function resetPrestartDisplay() {
  return {
    type: PRESTART_DISPLAY_RESET
  };
}

export function checkITFRequest(dispatch, hasSavedForm) {
  return apiRequest(
    '/intent_to_file',
    null,
    ({ data }) => {
      let status;
      let expirationDate;
      const itfList = data.attributes.intentToFile;
      // If the user does not have any existing ITFs, set none status
      if (!itfList || (Array.isArray(itfList) && itfList.length === 0)) {
        status = PRESTART_STATUSES.none;
      // If the user has existing ITFs, check for active ITFs
      } else {
        const activeList = itfList.filter(itf => itf.status === PRESTART_STATUSES.active);
        // If the user doesn't have any active ITFs, set expired status
        if (activeList.length === 0) {
          status = PRESTART_STATUSES.expired;
          expirationDate = getLatestTimestamp(itfList.map(itf => itf.expirationDate));
          // If the user has an active ITF, set retrieved status
        } else {
          status = PRESTART_STATUSES.retrieved;
          expirationDate = activeList[0].expirationDate;
        }
      }
      dispatch(setPrestartStatus(status, expirationDate));
      return status;
    },
    ({ errors }) => {
      const status = hasSavedForm ? PRESTART_STATUSES.notRetrievedSaved : PRESTART_STATUSES.notRetrievedNew;
      Raven.captureMessage('vets_itf_check_failure');
      dispatch(setPrestartStatus(status, errors));
      return status;
    }
  );
}

export function submitITFRequest(dispatch, successStatus, errorStatus) {

  return apiRequest(
    '/intent_to_file/compensation',
    { method: 'POST' },
    ({ data }) => {
      dispatch(setPrestartStatus(successStatus, data.attributes.intentToFile.expirationDate));
      return successStatus;
    },
    ({ errors }) => {
      Raven.captureMessage('vets_itf_submission_error');
      dispatch(setPrestartStatus(errorStatus, errors));
      return errorStatus;
    }
  );
}

export function verifyIntentToFile(hasSavedForm) {
  return async (dispatch) => {
    let submitSuccessStatus; // eslint-disable-line no-unused-vars
    let submitErrorStatus;
    dispatch(setPrestartStatus(PRESTART_STATUSES.pending));

    const existingITFStatus = await checkITFRequest(dispatch, hasSavedForm);

    if (prestartFailureStatuses.has(existingITFStatus)) {
      return false;
    } else if (prestartSuccessStatuses.has(existingITFStatus)) {
      return true;
    }

    if (existingITFStatus === PRESTART_STATUSES.none) {
      submitSuccessStatus = PRESTART_STATUSES.created;
      submitErrorStatus = PRESTART_STATUSES.notCreated;
    } else if (existingITFStatus === PRESTART_STATUSES.expired) {
      submitSuccessStatus = PRESTART_STATUSES.renewed;
      submitErrorStatus = PRESTART_STATUSES.notRenewed;
    }
    const newITFStatus = await submitITFRequest(dispatch, submitSuccessStatus, submitErrorStatus);

    if (prestartFailureStatuses.has(newITFStatus)) {
      return false;
    }
    return true;
  };
}
