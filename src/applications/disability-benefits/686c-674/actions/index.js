// import recordEvent from 'platform/monitoring/record-event';
// import { isServerError, isClientError } from '../config/utilities';

export const VERIFY_VA_FILE_NUMBER_STARTED = 'VERIFY_VA_FILE_NUMBER_STARTED';
export const VERIFY_VA_FILE_NUMBER_SUCCEEDED =
  'VERIFY_VA_FILE_NUMBER_SUCCEEDED';
export const VERIFY_VA_FILE_NUMBER_FAILED = 'VERIFY_VA_FILE_NUMBER_FAILED';

// VA file number is required to create a valid entry in BGS.

// This will eventually take apiRoute and options as it's params.
// stub out a response for now.
const getVaFileNumber = () =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve({ data: { attributes: true } });
    }, 4000);
  });

// stub out error response
// const getVaFileNumber = () =>
//   new Promise(reject => {
//     setTimeout(() => {
//       reject({ errors: [{ code: 404, message: 'error' }] });
//     }, 4000);
//   });

export const verifyVaFileNumber = () => async dispatch => {
  dispatch({ type: VERIFY_VA_FILE_NUMBER_STARTED, response: true });
  const response = await getVaFileNumber();
  if (response.errors) {
    // TODO: fire off analytics event when endpoint is wired up.
    //   const errCode = res.errors[0].code;
    //   isServerError(errCode) ? recordEvent({}) : recordEvent({})
    dispatch({ type: VERIFY_VA_FILE_NUMBER_FAILED, response });
  } else {
    dispatch({ type: VERIFY_VA_FILE_NUMBER_SUCCEEDED, response });
  }
};
