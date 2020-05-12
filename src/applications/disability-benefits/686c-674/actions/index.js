export const VERIFY_VA_FILE_NUMBER_STARTED = 'VERIFY_VA_FILE_NUMBER_STARTED';
export const VERIFY_VA_FILE_NUMBER_SUCCEEDED =
  'VERIFY_VA_FILE_NUMBER_SUCCEEDED';
export const VERIFY_VA_FILE_NUMBER_FAILED = 'VERIFY_VA_FILE_NUMBER_FAILED';

// VA file number is required to create a valid entry in BGS.

// This will eventually take apiRoute and options as it's params.
// const getVaFileNumber = async () => {
//   try {
//     // const response = await apiRequest(apiRoute, options);
//     return await Promise.resolve({ data: { attributes: true } });
//   } catch (error) {
//     return error;
//   }
// };

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
//       reject({ error: { message: 'error' } });
//     }, 4000);
//   });

export const verifyVaFileNumber = () => async dispatch => {
  dispatch({ type: VERIFY_VA_FILE_NUMBER_STARTED, response: true });
  const res = await getVaFileNumber();
  if (res?.data?.attributes) {
    dispatch({ type: VERIFY_VA_FILE_NUMBER_SUCCEEDED, response: true });
  } else if (res.error) {
    dispatch({ type: VERIFY_VA_FILE_NUMBER_FAILED, response: false });
  }
};
