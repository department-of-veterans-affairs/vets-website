import { apiRequest } from '../../../../platform/utilities/api';

import existingITFData from '../tests/itfData';

import { getLatestTimestamp } from '../helpers';

export const PRESTART_STATUS_SET = 'PRESTART_STATUS_SET';
export const PRESTART_DATA_SET = 'PRESTART_DATA_SET';
export const PRESTART_RESET = 'PRESTART_STATUS_RESET';
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

export function setPrestartStatus(status) {
  return {
    type: PRESTART_STATUS_SET,
    status
  };
}

export function setPrestartData(data) {
  return {
    type: PRESTART_DATA_SET,
    data
  };
}

export function resetPrestartStatus() {
  return {
    type: PRESTART_RESET
  };
}

export function resetPrestartDisplay() {
  return {
    type: PRESTART_DISPLAY_RESET
  };
}

export const handleCheckSuccess = (data, dispatch) => {
  const itfList = data.attributes.intentToFile;

  // If the user does not have any existing ITFs, set none status
  if (!itfList || (Array.isArray(itfList) && itfList.length === 0)) {
    return PRESTART_STATUSES.none;
  }

  // Check for an active ITF, the user should only have one
  const activeITF = itfList.filter(itf => itf.status === PRESTART_STATUSES.active)[0];
  const expiredITFs = itfList.filter(itf => itf.status === PRESTART_STATUSES.expired);
  // If the user has an active ITF, set retrieved status and currentExpirationDate
  if (activeITF) {
    dispatch(setPrestartData({ currentExpirationDate: activeITF.expirationDate }));
    return PRESTART_STATUSES.retrieved;
  }
  // If the user doesn't have any active ITFs
  // Check for expired ITFs, and if found, use the latest to set expired status and previousExpirationDate
  if (expiredITFs.length > 0) {
    const latestExpiredITFExpirationDate = getLatestTimestamp(expiredITFs.map(itf => itf.expirationDate));
    dispatch(setPrestartData({ previousExpirationDate: latestExpiredITFExpirationDate }));
    return PRESTART_STATUSES.expired;
  }

  // If the user does not have any expired or active ITFs, set none status
  return PRESTART_STATUSES.none;
};

export const handleCheckFailure = (error, hasSavedForm) => {
  const status = hasSavedForm ? PRESTART_STATUSES.notRetrievedSaved : PRESTART_STATUSES.notRetrievedNew;
  return status;
};

export function checkITFRequest(dispatch, hasSavedForm) {
  return apiRequest(
    '/intent_to_file',
    null,
    ({ data }) => handleCheckSuccess(data, dispatch),
    ({ errors }) => handleCheckFailure(errors, hasSavedForm, dispatch)
  );
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fakeITFRequest = async (url, options, success) => {
  await delay(1000);
  const response = new Response();
  response.data = existingITFData;
  return success(response);
};

export function mockCheckITFRequest(dispatch, hasSavedForm) {
  return fakeITFRequest(
    '/intent_to_file',
    null,
    ({ data }) => handleCheckSuccess(data, dispatch),
    ({ errors }) => handleCheckFailure(errors, hasSavedForm, dispatch)
  );
}

export const handleSubmitSuccess = (data, successStatus, dispatch) => {
  const expirationDate = data.attributes.intentToFile.expirationDate;
  dispatch(setPrestartData({ currentExpirationDate: expirationDate }));
  dispatch(setPrestartStatus(successStatus));
};

export const handleSubmitFailure = (error, errorStatus, dispatch) => {
  dispatch(setPrestartStatus(errorStatus));
};

export function submitITFRequest(dispatch, successStatus, errorStatus) {

  return apiRequest(
    '/intent_to_file/compensation',
    { method: 'POST' },
    ({ data }) => handleSubmitSuccess(data, successStatus, dispatch),
    ({ errors }) => handleSubmitFailure(errors, errorStatus, dispatch)
  );
}

export function verifyIntentToFile(hasSavedForm) {
  return async (dispatch) => {
    let submitSuccessStatus;
    let submitErrorStatus;
    dispatch(setPrestartStatus(PRESTART_STATUSES.pending));

    const existingITFStatus = await checkITFRequest(dispatch, hasSavedForm);
    dispatch(setPrestartStatus(existingITFStatus));

    if (!prestartPendingStatuses.has(existingITFStatus)) {
      return;
    }

    if (existingITFStatus === PRESTART_STATUSES.none) {
      submitSuccessStatus = PRESTART_STATUSES.created;
      submitErrorStatus = PRESTART_STATUSES.notCreated;
    } else if (existingITFStatus === PRESTART_STATUSES.expired) {
      submitSuccessStatus = PRESTART_STATUSES.renewed;
      submitErrorStatus = PRESTART_STATUSES.notRenewed;
    }
    submitITFRequest(dispatch, submitSuccessStatus, submitErrorStatus);
  };
}
