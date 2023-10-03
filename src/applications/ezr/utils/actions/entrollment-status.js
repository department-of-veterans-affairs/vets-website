import appendQuery from 'append-query';
import { apiRequest } from 'platform/utilities/api';

import { selectEnrollmentStatus } from '../selectors/entrollment-status';
import { ENROLLMENT_STATUS_ACTIONS } from '../constants';

/**
 * Action to fetch the current enrollment status based on the provided user data
 * @param {Object} formData - data object from the ID form fields
 * @returns {Promise} - resolves to calling the reducer to set the correct state variables
 * for enrollment status
 */
export function fetchEnrollmentStatus(formData = {}) {
  return (dispatch, getState) => {
    const { isLoading } = selectEnrollmentStatus(getState());
    if (isLoading) return null;

    const {
      FETCH_ENROLLMENT_STATUS_STARTED,
      FETCH_ENROLLMENT_STATUS_FAILED,
      FETCH_ENROLLMENT_STATUS_SUCCEEDED,
    } = ENROLLMENT_STATUS_ACTIONS;
    const { firstName, lastName, dob, ssn } = formData;

    dispatch({ type: FETCH_ENROLLMENT_STATUS_STARTED });

    const baseUrl = `/health_care_applications/enrollment_status`;
    const requestUrl = appendQuery(baseUrl, {
      'userAttributes[veteranFullName][first]': firstName,
      'userAttributes[veteranFullName][last]': lastName,
      'userAttributes[veteranDateOfBirth]': dob,
      'userAttributes[veteranSocialSecurityNumber]': ssn,
    });

    return apiRequest(requestUrl)
      .then(response =>
        dispatch({ type: FETCH_ENROLLMENT_STATUS_SUCCEEDED, response }),
      )
      .catch(({ errors }) =>
        dispatch({ type: FETCH_ENROLLMENT_STATUS_FAILED, errors }),
      );
  };
}
