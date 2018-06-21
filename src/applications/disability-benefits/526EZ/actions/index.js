import { apiRequest } from '../../../../platform/utilities/api';
import get from '../../../../platform/utilities/data/get';
import existingITFData from '../tests/itfData';

export const PRESTART_STATUS_SET = 'PRESTART_STATUS_SET';
export const PRESTART_DATA_SET = 'PRESTART_DATA_SET';
export const PRESTART_STATE_RESET = 'PRESTART_STATE_RESET';
export const PRESTART_DISPLAY_RESET = 'PRESTART_DISPLAY_RESET';

export const PRESTART_STATUSES = {
  notAttempted: 'not-attempted',
  pending: 'pending',
  succeeded: 'succeeded',
  failed: 'failed'
};

export const PRESTART_VERIFICATION_TYPES = {
  retrieve: 'retrieve',
  create: 'create'
};

export const ITF_STATUSES = {
  expired: 'expired',
  active: 'active'
};

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

export function resetPrestartState() {
  return {
    type: PRESTART_STATE_RESET
  };
}

export function resetPrestartDisplay() {
  return {
    type: PRESTART_DISPLAY_RESET
  };
}

// Returns most recent timestamp from a list of timestamps
export const getLatestTimestamp = (timestamps) => timestamps.sort((a, b) => new Date(b) - new Date(a))[0];
export const getITFsByStatus = (itfs, status) => itfs.filter(itf => itf.status === status);

export const handleCheckSuccess = (data, dispatch) => {
  const itfList = get('attributes.intentToFile', data);

  // If the user does not have any existing ITFs, create one
  if (itfList.length === 0) {
    return true;
  }

  // Check for an active ITF, the user should only have one
  const activeITF = getITFsByStatus(itfList, ITF_STATUSES.active)[0];
  const expiredITFs = getITFsByStatus(itfList, ITF_STATUSES.expired);
  // If the user has an active ITF, set currentExpirationDate
  if (activeITF) {
    dispatch(setPrestartData({ currentExpirationDate: activeITF.expirationDate }));
    dispatch(setPrestartStatus(PRESTART_STATUSES.succeeded));
    return false;
  }
  // If the user doesn't have any active ITFs
  // Check for expired ITFs, and if found, use the latest to set previousExpirationDate
  // and create a new ITF
  if (expiredITFs.length > 0) {
    const latestExpiredITFExpirationDate = getLatestTimestamp(expiredITFs.map(itf => itf.expirationDate));
    dispatch(setPrestartData({ previousExpirationDate: latestExpiredITFExpirationDate }));
    return true;
  }

  // If the user does not have any expired or active ITFs, create one
  return true;
};

export const handleCheckFailure = (dispatch) => {
  dispatch(setPrestartStatus(PRESTART_STATUSES.failed));
  return false;
};

export function checkITFRequest(dispatch) {
  dispatch(setPrestartData({ verificationType: PRESTART_VERIFICATION_TYPES.retrieve }));

  return apiRequest(
    '/intent_to_file',
    null,
    ({ data }) => handleCheckSuccess(data, dispatch),
    () => handleCheckFailure(dispatch)
  );
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fakeITFRequest = async (url, options, success) => {
  await delay(1000);
  const response = new Response();
  response.data = existingITFData;
  return success(response);
};

// TODO: remove this mock and its helpers once user testing is complete
export function mockCheckITFRequest(dispatch) {
  dispatch(setPrestartData({ verificationType: PRESTART_VERIFICATION_TYPES.retrieve }));

  return fakeITFRequest(
    '/intent_to_file',
    null,
    ({ data }) => handleCheckSuccess(data, dispatch),
    () => handleCheckFailure(dispatch)
  );
}

export const handleSubmitSuccess = (data, dispatch) => {
  const expirationDate = data.attributes.intentToFile.expirationDate;
  dispatch(setPrestartData({ currentExpirationDate: expirationDate }));
  dispatch(setPrestartStatus(PRESTART_STATUSES.succeeded));
};

export const handleSubmitFailure = (dispatch) => {
  dispatch(setPrestartStatus(PRESTART_STATUSES.failed));
};

export function submitITFRequest(dispatch) {
  dispatch(setPrestartData({ verificationType: PRESTART_VERIFICATION_TYPES.create }));

  return apiRequest(
    '/intent_to_file/compensation',
    { method: 'POST' },
    ({ data }) => handleSubmitSuccess(data, dispatch),
    () => handleSubmitFailure(dispatch)
  );
}

export function verifyIntentToFile() {
  return async (dispatch) => {

    dispatch(setPrestartStatus(PRESTART_STATUSES.pending));

    const existingITFNotFound = await mockCheckITFRequest(dispatch);

    if (existingITFNotFound) {
      submitITFRequest(dispatch);
    }
  };
}

export function submitIntentToFile(formConfig, onChange) { // TODO: replace with ITF react work
  return () => {
    onChange('active');
  };
}
