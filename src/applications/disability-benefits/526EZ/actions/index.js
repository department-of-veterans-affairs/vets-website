// import { apiRequest } from '../../../../platform/utilities/api';
// import Raven from 'raven-js';

// function fetchITF(itfUrl, optionalSettings = null) {
//   return apiRequest(
//     `${itfUrl}`,
//     optionalSettings,
//     ({ data }) => {
//       const { status, expirationDate }  = data.attributes.intent_to_file;
//       return { status, expirationDate };
//     },
//     ({ errors }) => {
//       const errorMessage = 'Network request failed';
//       Raven.captureMessage(`vets_itf_error: ${errorMessage}`);
//       return { errorMessage, errors };
//     }
//   );
// }

function fakeFetch(x) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(x);
    }, 2000);
  });
}


// async function processITF(itfUrl, options = null, dispatch) {
//   const ITF = await fetchITF(itfUrl, options);
//   dispatch({ type: 'SET_PRESTART_STATUS', ...ITF });
//   return ITF;
// }

async function fakeFetchITF(mockITF, dispatch) {

  const ITF = await fakeFetch(mockITF);
  if (ITF.status && ITF.status === 'active') {
    dispatch({ type: 'SET_PRESTART_STATUS', ...ITF });
  }
  return ITF;
}

export function submitIntentToFile(formConfig, resolve, reject) {
  return async (dispatch) => {
    const mockITFfailure = { errorMessage: 'Network request failed', errors: [2, 3] };
    // const mockITFsuccess = { status: 'active', expirationDate: '2018-12-12' };
    // const mockITFexpired = { status: 'expired', expirationDate: '2012-12-12' };
    dispatch({ type: 'SET_PRESTART_PENDING' });
    // const existingITF = await processITF('/intent_to_file/compensation/active', null, dispatch);
    const existingITF = await fakeFetchITF(mockITFfailure, dispatch);
    if (existingITF && existingITF.status === 'active') {
      return;
    }
    // const newITF = await processITF('/intent_to_file/compensation', { method: 'POST' }, dispatch);
    const newITF = await fakeFetchITF(mockITFfailure, dispatch);
    if (!newITF.status || newITF.status !== 'active') {
      dispatch({ type: 'SET_PRESTART_STATUS', ...newITF });
      reject(newITF);
    }
  };
}
