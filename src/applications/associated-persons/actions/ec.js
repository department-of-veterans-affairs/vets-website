// import * as Sentry from '@sentry/browser';
import { apiRequest } from '~/platform/utilities/api';

export const FETCH_EMERGENCY_CONTACTS_STARTED =
  'FETCH_EMERGENCY_CONTACTS_STARTED';
export const FETCH_EMERGENCY_CONTACTS_SUCCEEDED =
  'FETCH_EMERGENCY_CONTACTS_SUCCEEDED';
export const FETCH_EMERGENCY_CONTACTS_FAILED =
  'FETCH_EMERGENCY_CONTACTS_FAILED';

export const fetchEmergencyContactsStarted = () => ({
  type: FETCH_EMERGENCY_CONTACTS_STARTED,
});

export const fetchEmergencyContactsSucceeded = payload => ({
  type: FETCH_EMERGENCY_CONTACTS_SUCCEEDED,
  payload,
});

export const fetchEmergencyContactsFailed = payload => ({
  type: FETCH_EMERGENCY_CONTACTS_FAILED,
  payload,
});

export const fetchEmergencyContacts = () => dispatch => {
  dispatch(fetchEmergencyContactsStarted());
  return apiRequest('/emergency_contacts')
    .then(({ data }) => dispatch(fetchEmergencyContactsSucceeded(data)))
    .catch(err => {
      // // report fetching data failed
      // Sentry.withScope(scope => {
      //   scope.setExtra('error', err);
      //   Sentry.captureMessage(FETCH_EMERGENCY_CONTACTS_FAILED);
      // });
      dispatch(fetchEmergencyContactsFailed(err));
    });
};
