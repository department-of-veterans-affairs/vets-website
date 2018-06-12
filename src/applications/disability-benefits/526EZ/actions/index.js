import { apiRequest } from '../../../../platform/utilities/api';
import Raven from 'raven-js';

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
      if (!itfList || (Array.isArray(itfList) && itfList.length === 0)) {
        status = PRESTART_STATUSES.none;
      } else {
        const activeList = itfList.filter(itf => itf.status === PRESTART_STATUSES.active);
        if (activeList.length === 0) {
          status = PRESTART_STATUSES.expired;
          expirationDate = itfList.sort((a, b) => new Date(a.expirationDate) - new Date(b.expirationDate))[0].expirationDate;
        } else {
          status = PRESTART_STATUSES.retrieved;
          expirationDate = activeList[0].expirationDate;
        }
      }
      dispatch(setPrestartStatus(status, expirationDate));
      return status;
    },
    ({ errors }) => {
      const errorMessage = 'Network request failed';
      const status = hasSavedForm ? PRESTART_STATUSES.notRetrievedSaved : PRESTART_STATUSES.notRetrievedNew;
      Raven.captureMessage(`vets_itf_error: ${errorMessage}`);
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
      const errorMessage = 'Network request failed';
      Raven.captureMessage(`vets_itf_error: ${errorMessage}`);
      dispatch(setPrestartStatus(errorStatus, errors));
      return errorStatus;
    }
  );
}

// function fakeITFRequest(x, cb) { // remove once local testing complete
//   return new Promise(resolve => {
//     setTimeout(() => {
//       cb();
//       resolve(x);
//     }, 2000);
//   });
// }

export function verifyIntentToFile(hasSavedForm) {
  return async (dispatch) => {
    let submitSuccessStatus; // eslint-disable-line no-unused-vars
    let submitErrorStatus;
    dispatch(setPrestartStatus(PRESTART_STATUSES.pending));

    const existingITFStatus = await checkITFRequest(dispatch, hasSavedForm);
    // const existingITFStatus = await fakeITFRequest('none', () => dispatch(setPrestartStatus(PRESTART_STATUSES.none, '2017-08-17T21:59:53.327Z')));  // remove once local testing complete

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
    // const newITFStatus = await fakeITFRequest('created', () => dispatch(setPrestartStatus(PRESTART_STATUSES.created, '2017-08-17T21:59:53.327Z'))); // remove once local testing complete

    if (prestartFailureStatuses.has(newITFStatus)) {
      return false;
    }
    return true;
  };
}
