import { apiRequest } from '../../../../platform/utilities/api';
import Raven from 'raven-js';
import { setPrestartStatus } from '../../../common/schemaform/save-in-progress/actions';
import { PRESTART_STATUSES } from '../helpers';

export function checkITFRequest(dispatch) {

  return apiRequest(
    '/intent_to_file/compensation',
    null,
    ({ data }) => {
      let status;
      let expirationDate;
      const itfList = data.attributes.intent_to_file;
      if (itfList.length === 0) {
        status = PRESTART_STATUSES.none;
      } else {
        const activeList = itfList.filter(itf => itf.status === 'active');
        if (activeList.length === 0) {
          status = PRESTART_STATUSES.inactive;
        } else {
          status = PRESTART_STATUSES.success;
          expirationDate = activeList[0].expirationDate;
        }
      }
      dispatch(setPrestartStatus(status, expirationDate));
      return status;
    },
    ({ errors }) => {
      const errorMessage = 'Network request failed';
      Raven.captureMessage(`vets_itf_error: ${errorMessage}`);
      dispatch(setPrestartStatus(PRESTART_STATUSES.failure, errors));
      return PRESTART_STATUSES.failure;
    }
  );
}

export function submitITFRequest(dispatch) {

  return apiRequest(
    '/intent_to_file/compensation',
    { method: 'POST' },
    ({ data }) => {
      dispatch(setPrestartStatus(PRESTART_STATUSES.success, data.attributes.intent_to_file.expirationDate));
      return PRESTART_STATUSES.success;
    },
    ({ errors }) => {
      const errorMessage = 'Network request failed';
      Raven.captureMessage(`vets_itf_error: ${errorMessage}`);
      dispatch(setPrestartStatus(PRESTART_STATUSES.failure, errors));
      return PRESTART_STATUSES.failure;
    }
  );
}

function fakeITFRequest(x, cb) {
  return new Promise(resolve => {
    setTimeout(() => {
      cb();
      resolve(x);
    }, 2000);
  });
}

export function verifyIntentToFile() {
  return async (dispatch) => {

    dispatch(setPrestartStatus(PRESTART_STATUSES.pending));
    // const existingITF = await checkITFRequest(dispatch);
    const existingITFStatus = await fakeITFRequest('pending', () => dispatch(setPrestartStatus(PRESTART_STATUSES.pending)));

    if (existingITFStatus === PRESTART_STATUSES.failure) {
      return false;
    } else if (existingITFStatus === PRESTART_STATUSES.success) {
      return true;
    }

    // const newITF = await submitITFRequest(dispatch);
    const newITFStatus = await fakeITFRequest('success', () => dispatch(setPrestartStatus(PRESTART_STATUSES.success, '2018-12-12')));

    if (newITFStatus === PRESTART_STATUSES.failure) {
      return false;
    }
    return true;
  };
}
