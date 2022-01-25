import { apiRequest } from 'platform/utilities/api';

export const GENERATE_AUTOMATIC_COE_STARTED = 'GENERATE_AUTOMATIC_COE_STARTED';
export const GENERATE_AUTOMATIC_COE_SUCCEEDED =
  'GENERATE_AUTOMATIC_COE_SUCCEEDED';
export const GENERATE_AUTOMATIC_COE_FAILED = 'GENERATE_AUTOMATIC_COE_FAILED';
export const SKIP_AUTOMATIC_COE_CHECK = 'SKIP_AUTOMATIC_COE_CHECK';
export const GET_COE_URL_SUCCEEDED = 'GET_COE_URL_SUCCEEDED';
export const GET_COE_URL_FAILED = 'GET_COE_URL_FAILED';

const COE_DOWNLOAD_URI = '/coe/download_coe';
const COE_STATUS_URI = '/coe/status';

export const getCoeStatus = async () => {
  try {
    const response = await apiRequest(COE_STATUS_URI);
    return response.data.attributes;
  } catch (error) {
    return error;
  }
};

export const getCoeURL = async () => {
  try {
    const response = await apiRequest(COE_DOWNLOAD_URI);
    return response.data.attributes;
  } catch (error) {
    return error;
  }
};

export const generateCoe = (skip = '') => async dispatch => {
  const shouldSkip = !!skip;
  if (!shouldSkip) {
    dispatch({ type: GENERATE_AUTOMATIC_COE_STARTED });
    const response = await getCoeStatus();
    if (response.errors) {
      dispatch({ type: GENERATE_AUTOMATIC_COE_FAILED, response });
    } else {
      dispatch({ type: GENERATE_AUTOMATIC_COE_SUCCEEDED, response });

      const { status } = response;

      if (status === 'available' || status === 'eligible') {
        const res = await getCoeURL();
        if (res.errors) {
          dispatch({ type: GET_COE_URL_FAILED, response: res });
        } else {
          dispatch({ type: GET_COE_URL_SUCCEEDED, response: res });
        }
      }
    }
    return response;
  } else {
    dispatch({ type: SKIP_AUTOMATIC_COE_CHECK });
  }

  return null;
};
