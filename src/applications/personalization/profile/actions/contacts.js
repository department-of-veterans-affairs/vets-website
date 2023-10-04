// import * as Sentry from '@sentry/browser';
import { apiRequest } from '~/platform/utilities/api';

export const FETCH_PROFILE_CONTACTS_STARTED ='FETCH_PROFILE_CONTACTS_STARTED';
export const FETCH_PROFILE_CONTACTS_SUCCEEDED = 'FETCH_PROFILE_CONTACTS_SUCCEEDED';
export const FETCH_PROFILE_CONTACTS_FAILED = 'FETCH_PROFILE_CONTACTS_FAILED';

export const fetchProfileContactsStarted = () => ({
  type: FETCH_PROFILE_CONTACTS_STARTED,
});

export const fetchProfileContactsSucceeded = payload => ({
  type: FETCH_PROFILE_CONTACTS_SUCCEEDED,
  payload,
});

export const fetchProfileContactsFailed = payload => ({
  type: FETCH_PROFILE_CONTACTS_FAILED,
  payload,
});

export const fetchProfileContacts = () => dispatch => {
  dispatch(fetchProfileContactsStarted());
  return apiRequest('/profile/contacts')
    .then(({ data }) => dispatch(fetchProfileContactsSucceeded(data)))
    .catch(err => {
      // // report fetching data failed
      // Sentry.withScope(scope => {
      //   scope.setExtra('error', err);
      //   Sentry.captureMessage(FETCH_PROFILE_CONTACTS_FAILED);
      // });
      dispatch(fetchProfileContactsFailed(err));
    });
};
