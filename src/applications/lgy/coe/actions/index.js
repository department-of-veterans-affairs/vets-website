export const GENERATE_AUTOMATIC_COE_STARTED = 'GENERATE_AUTOMATIC_COE_STARTED';
export const GENERATE_AUTOMATIC_COE_SUCCEEDED =
  'GENERATE_AUTOMATIC_COE_SUCCEEDED';
export const GENERATE_AUTOMATIC_COE_FAILED = 'GENERATE_AUTOMATIC_COE_FAILED';

const mockApiCall = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ coe: true });
    }, 2000);
  });
};

export const generateCoe = () => async dispatch => {
  dispatch({ type: GENERATE_AUTOMATIC_COE_STARTED });
  const response = await mockApiCall();
  if (response.errors) {
    dispatch({ type: GENERATE_AUTOMATIC_COE_FAILED, response });
  } else {
    dispatch({ type: GENERATE_AUTOMATIC_COE_SUCCEEDED, response });
  }
};
