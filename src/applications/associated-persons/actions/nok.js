// import * as Sentry from '@sentry/browser';
import { apiRequest } from '~/platform/utilities/api';

export const FETCH_NEXT_OF_KIN_STARTED = 'FETCH_NEXT_OF_KIN_STARTED';
export const FETCH_NEXT_OF_KIN_SUCCEEDED = 'FETCH_NEXT_OF_KIN_SUCCEEDED';
export const FETCH_NEXT_OF_KIN_FAILED = 'FETCH_NEXT_OF_KIN_FAILED';

export const fetchNextOfKinStarted = () => ({
  type: FETCH_NEXT_OF_KIN_STARTED,
});

export const fetchNextOfKinSucceeded = payload => ({
  type: FETCH_NEXT_OF_KIN_SUCCEEDED,
  payload,
});

export const fetchNextOfKinFailed = payload => ({
  type: FETCH_NEXT_OF_KIN_FAILED,
  payload,
});

export const fetchNextOfKin = () => dispatch => {
  dispatch(fetchNextOfKinStarted());
  return apiRequest('/next_of_kin')
    .then(({ data }) => dispatch(fetchNextOfKinSucceeded(data)))
    .catch(err => {
      // // report fetching data failed
      // Sentry.withScope(scope => {
      //   scope.setExtra('error', err);
      //   Sentry.captureMessage(FETCH_NEXT_OF_KIN_FAILED);
      // });
      dispatch(fetchNextOfKinFailed(err));
    });
};
