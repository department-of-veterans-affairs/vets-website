import { apiRequest } from '../../../../platform/utilities/api';
import Raven from 'raven-js';

export const SET_PRESTART_STATUS = 'SET_PRESTART_STATUS';
export const UNSET_PRESTART_STATUS = 'UNSET_PRESTART_STATUS';
export const UNSET_PRESTART_DISPLAY = 'UNSET_PRESTART_DISPLAY';

export const PRESTART_STATUSES = {
  notAttempted: 'not-attempted',
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
    type: SET_PRESTART_STATUS,
    status,
    data
  };
}

export function unsetPrestartStatus() {
  return {
    type: UNSET_PRESTART_STATUS
  };
}

export function unsetPrestartDisplay() {
  return {
    type: UNSET_PRESTART_DISPLAY
  };
}

export function checkITFRequest(dispatch, hasSavedForm) {

  return apiRequest(
    '/intent_to_file',
    null,
    ({ data }) => {
      let status;
      let expirationDate;
      const itfList = data.attributes.intent_to_file;
      if (itfList.length === 0) {
        status = PRESTART_STATUSES.none;
      } else {
        const activeList = itfList.filter(itf => itf.status === 'active');
        if (activeList.length === 0) {
          status = PRESTART_STATUSES.expired;
          expirationDate = itfList.sort((a, b) => a.expirationDate - b.expirationDate)[0];
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
      dispatch(setPrestartStatus(successStatus, data.attributes.intent_to_file.expirationDate));
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

function fakeITFRequest(x, cb) {
  return new Promise(resolve => {
    setTimeout(() => {
      cb();
      resolve(x);
    }, 2000);
  });
}

export function verifyIntentToFile(hasSavedForm) {
  return async (dispatch) => {
    let newSuccessStatus; // eslint-disable-line no-unused-vars
    dispatch(setPrestartStatus(PRESTART_STATUSES.pending));
    
    // const existingITFStatus = await checkITFRequest(dispatch, hasSavedForm);
    const existingITFStatus = await fakeITFRequest('none', () => dispatch(setPrestartStatus(PRESTART_STATUSES.none, '2017-08-17T21:59:53.327Z')));

    if (prestartFailureStatuses.has(existingITFStatus)) {
      return false;
    } else if (prestartSuccessStatuses.has(existingITFStatus)) {
      return true;
    }

    if (existingITFStatus === PRESTART_STATUSES.none) {
      newSuccessStatus = PRESTART_STATUSES.created;
    } else if (existingITFStatus === PRESTART_STATUSES.expired) {
      newSuccessStatus = PRESTART_STATUSES.renewed;
    }
    // const newITFStatus = await submitITFRequest(dispatch, newSuccessStatus);
    const newITFStatus = await fakeITFRequest('created', () => dispatch(setPrestartStatus(PRESTART_STATUSES.created, '2017-08-17T21:59:53.327Z')));

    if (newITFStatus === PRESTART_STATUSES.failure) {
      return false;
    }
    return true;
  };
}
