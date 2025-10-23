import { apiRequest } from 'platform/utilities/api';

export const GENERATE_AUTOMATIC_COE_STARTED = 'GENERATE_AUTOMATIC_COE_STARTED';
export const GENERATE_AUTOMATIC_COE_SUCCEEDED =
  'GENERATE_AUTOMATIC_COE_SUCCEEDED';
export const GENERATE_AUTOMATIC_COE_FAILED = 'GENERATE_AUTOMATIC_COE_FAILED';
export const SKIP_AUTOMATIC_COE_CHECK = 'SKIP_AUTOMATIC_COE_CHECK';

const COE_STATUS_URI = '/coe/status';

export const getCoeStatus = async () => {
  try {
    const response = await apiRequest(COE_STATUS_URI);
    return response.data.attributes;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const generateCoe = (skip = false) => async dispatch => {
  if (!skip) {
    dispatch({ type: GENERATE_AUTOMATIC_COE_STARTED });
    return getCoeStatus()
      .then(response => {
        dispatch({ type: GENERATE_AUTOMATIC_COE_SUCCEEDED, response });
        return response;
      })
      .catch(response => {
        dispatch({ type: GENERATE_AUTOMATIC_COE_FAILED, response });
        return response;
      });
  }

  dispatch({ type: SKIP_AUTOMATIC_COE_CHECK });
  return null;
};
