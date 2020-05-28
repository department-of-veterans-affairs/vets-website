import { fetchAndUpdateSessionExpiration as fetch } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';
import {
  MDOT_API_ERROR,
  MDOT_RESET_ERRORS,
  MDOT_API_CALL_INITIATED,
} from '../constants';
import moment from 'moment';
import sortBy from 'lodash/sortBy';
import head from 'lodash/head';
import get from 'lodash/get';
import localStorage from 'platform/utilities/storage/localStorage';

const handleError = (error, nextAvailabilityDate = '') => ({
  type: MDOT_API_ERROR,
  error,
  nextAvailabilityDate,
});

const resetError = () => ({
  type: MDOT_RESET_ERRORS,
});

const initiateApiCall = () => ({
  type: MDOT_API_CALL_INITIATED,
});

export const fetchFormStatus = () => async dispatch => {
  dispatch(initiateApiCall());
  const sessionExpiration = localStorage.getItem('sessionExpiration');
  const remainingSessionTime = moment(sessionExpiration).diff(moment());
  if (!remainingSessionTime) {
    // bail if there isn't a current session
    // the API returns the same response if a user is missing data OR is not logged in
    // so we need a way to differentiate those - a falsey remaining session will
    // always result in that error so we can go ahead and return
    return dispatch(resetError());
  }
  fetch(`${environment.API_URL}/v0/in_progress_forms/MDOT`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Key-Inflection': 'camel',
      'Source-App-Name': window.appName,
    },
  })
    .then(res => res.json())
    .then(body => {
      if (body.errors) {
        // In the event there are multiple errors - but I don't think that is possible
        const firstError = head(body.errors);
        if (firstError.code === '500') {
          return dispatch(resetError());
        }
        return dispatch(handleError(firstError.code.toUpperCase()));
      }
      const eligibility = body.formData.eligibility;

      if (eligibility && !eligibility.accessories && !eligibility.batteries) {
        const sortedSuppliesByAvailability = sortBy(
          body.formData.supplies,
          'nextAvailabilityDate',
        );
        const firstSupplyInSupplies = head(sortedSuppliesByAvailability);
        const nextAvailabilityDate = get(
          firstSupplyInSupplies,
          'nextAvailabilityDate',
        );
        return dispatch(
          handleError('MDOT_SUPPLIES_INELIGIBLE', nextAvailabilityDate),
        );
      }
      return dispatch(resetError());
    });
  return null;
};
