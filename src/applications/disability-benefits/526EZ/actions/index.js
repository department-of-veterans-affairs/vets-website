import { apiRequest } from '../../../../platform/utilities/api';

import existingITFData from '../tests/itfData';

import { getLatestTimestamp } from '../helpers';

export const PRESTART_STATUS_SET = 'PRESTART_STATUS_SET';
export const PRESTART_MESSAGE_SET = 'PRESTART_MESSAGE_SET';
export const PRESTART_DATA_SET = 'PRESTART_DATA_SET';
export const PRESTART_RESET = 'PRESTART_STATUS_RESET';
export const PRESTART_DISPLAY_RESET = 'PRESTART_DISPLAY_RESET';

export const PRESTART_STATUSES = {
  notAttempted: 'not-attempted',
  pending: 'pending',
  succeeded: 'suceeded',
  failed: 'failed'
};

export const PRESTART_MESSAGES = {
  notAttempted: 'not-attempted',
  active: 'active',
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

export const prestartSuccessMessages = new Set([PRESTART_MESSAGES.created, PRESTART_MESSAGES.retrieved, PRESTART_MESSAGES.renewed]);

export const prestartFailureMessages = new Set([PRESTART_MESSAGES.notCreated, PRESTART_MESSAGES.notRenewed, PRESTART_MESSAGES.notRetrievedNew, PRESTART_MESSAGES.notRetrievedSaved]);

export const prestartPendingMessages = new Set([PRESTART_MESSAGES.none, PRESTART_MESSAGES.expired]);

export function setPrestartStatus(status) {
  return {
    type: PRESTART_STATUS_SET,
    status
  };
}

export function setPrestartMessage(message) {
  return {
    type: PRESTART_MESSAGE_SET,
    message
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
  const activeITF = itfList.filter(itf => itf.status === PRESTART_MESSAGES.active)[0];
  const expiredITFs = itfList.filter(itf => itf.status === PRESTART_MESSAGES.expired);
  // If the user has an active ITF, set retrieved status and currentExpirationDate
  if (activeITF) {
    dispatch(setPrestartData({ currentExpirationDate: activeITF.expirationDate }));
    dispatch(setPrestartStatus(PRESTART_STATUSES.succeeded));
    return PRESTART_MESSAGES.retrieved;
  }
  // If the user doesn't have any active ITFs
  // Check for expired ITFs, and if found, use the latest to set expired status and previousExpirationDate
  if (expiredITFs.length > 0) {
    const latestExpiredITFExpirationDate = getLatestTimestamp(expiredITFs.map(itf => itf.expirationDate));
    dispatch(setPrestartData({ previousExpirationDate: latestExpiredITFExpirationDate }));
    return PRESTART_MESSAGES.expired;
  }

  // If the user does not have any expired or active ITFs, set none status
  return PRESTART_MESSAGES.none;
};

export const handleCheckFailure = (error, hasSavedForm, dispatch) => {
  const status = hasSavedForm ? PRESTART_MESSAGES.notRetrievedSaved : PRESTART_MESSAGES.notRetrievedNew;
  dispatch(setPrestartStatus(PRESTART_STATUSES.failed));
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

// TODO: remove this mock once user testing is complete
export function mockCheckITFRequest(dispatch, hasSavedForm) {
  return fakeITFRequest(
    '/intent_to_file',
    null,
    ({ data }) => handleCheckSuccess(data, dispatch),
    ({ errors }) => handleCheckFailure(errors, hasSavedForm, dispatch)
  );
}

export const handleSubmitSuccess = (data, successMessage, dispatch) => {
  const expirationDate = data.attributes.intentToFile.expirationDate;
  dispatch(setPrestartData({ currentExpirationDate: expirationDate }));
  dispatch(setPrestartStatus(PRESTART_STATUSES.succeeded));
  dispatch(setPrestartMessage(successMessage));
};

export const handleSubmitFailure = (error, errorMessage, dispatch) => {
  dispatch(setPrestartStatus(PRESTART_STATUSES.failed));
  dispatch(setPrestartMessage(errorMessage));
};

export function submitITFRequest(dispatch, successMessage, errorMessage) {

  return apiRequest(
    '/intent_to_file/compensation',
    { method: 'POST' },
    ({ data }) => handleSubmitSuccess(data, successMessage, dispatch),
    ({ errors }) => handleSubmitFailure(errors, errorMessage, dispatch)
  );
}

export function verifyIntentToFile(hasSavedForm) {
  return async (dispatch) => {
    let submitSuccessMessage;
    let submitErrorMessage;
    dispatch(setPrestartStatus(PRESTART_STATUSES.pending));

    const existingITFMessage = await checkITFRequest(dispatch, hasSavedForm);

    if (!prestartPendingMessages.has(existingITFMessage)) {
      dispatch(setPrestartMessage(existingITFMessage));
      return;
    }

    if (existingITFMessage === PRESTART_MESSAGES.none) {
      submitSuccessMessage = PRESTART_MESSAGES.created;
      submitErrorMessage = PRESTART_MESSAGES.notCreated;
    } else if (existingITFMessage === PRESTART_MESSAGES.expired) {
      submitSuccessMessage = PRESTART_MESSAGES.renewed;
      submitErrorMessage = PRESTART_MESSAGES.notRenewed;
    }
    submitITFRequest(dispatch, submitSuccessMessage, submitErrorMessage);
  };
}
