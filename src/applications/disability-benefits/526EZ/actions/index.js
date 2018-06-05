import { apiRequest } from '../../../../platform/utilities/api';
import Raven from 'raven-js';
import { setPrestartStatus } from '../../../common/schemaform/save-in-progress/actions';
import { PRESTART_STATUSES, prestartSuccessStatuses } from '../helpers';

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
          status = PRESTART_STATUSES.expired;
          expirationDate = itfList.sort((a, b) => a.expirationDate - b.expirationDate)[0];
        } else {
          status = PRESTART_STATUSES.retrieved;
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

export function submitITFRequest(dispatch, successStatus) {

  return apiRequest(
    '/intent_to_file/compensation',
    { method: 'POST' },
    ({ data }) => {
      dispatch(setPrestartStatus(successStatus, data.attributes.intent_to_file.expirationDate));
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
    let newSuccessStatus; // eslint-disable-line no-unused-vars
    dispatch(setPrestartStatus(PRESTART_STATUSES.pending));
    // const existingITF = await checkITFRequest(dispatch);
    const existingITFStatus = await fakeITFRequest('retrieved', () => dispatch(setPrestartStatus(PRESTART_STATUSES.retrieved, '2017-08-17T21:59:53.327Z')));

    if (existingITFStatus === PRESTART_STATUSES.failure) {
      return false;
    } else if (prestartSuccessStatuses.has(existingITFStatus)) {
      return true;
    }

    if (existingITFStatus === PRESTART_STATUSES.none) {
      newSuccessStatus = PRESTART_STATUSES.created;
    } else if (existingITFStatus === PRESTART_STATUSES.expired) {
      newSuccessStatus = PRESTART_STATUSES.renewed;
    }
    // const newITF = await submitITFRequest(dispatch, newSuccessStatus);
    const newITFStatus = await fakeITFRequest('created', () => dispatch(setPrestartStatus(PRESTART_STATUSES.created, '2017-08-17T21:59:53.327Z')));

    if (newITFStatus === PRESTART_STATUSES.failure) {
      return false;
    }
    return true;
  };
}
