export const GENERATE_AUTOMATIC_COE_STARTED = 'GENERATE_AUTOMATIC_COE_STARTED';
export const GENERATE_AUTOMATIC_COE_SUCCEEDED =
  'GENERATE_AUTOMATIC_COE_SUCCEEDED';
export const GENERATE_AUTOMATIC_COE_FAILED = 'GENERATE_AUTOMATIC_COE_FAILED';
export const SKIP_AUTOMATIC_COE_CHECK = 'SKIP_AUTOMATIC_COE_CHECK';

const mockApiCall = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ status: 'unable-to-determine-eligibility' });
    }, 2000);
  });
  //   return new Promise(reject => {
  //     setTimeout(() => {
  //       reject({ errors: [{ status: '500' }] });
  //     }, 2000);
  //   });
};

export const generateCoe = (skip = '') => async dispatch => {
  const shouldSkip = !!skip;
  if (!shouldSkip) {
    dispatch({ type: GENERATE_AUTOMATIC_COE_STARTED });
    const response = await mockApiCall();
    if (response.errors) {
      dispatch({ type: GENERATE_AUTOMATIC_COE_FAILED, response });
    } else {
      dispatch({ type: GENERATE_AUTOMATIC_COE_SUCCEEDED, response });
    }
  } else {
    dispatch({ type: SKIP_AUTOMATIC_COE_CHECK });
  }
};
