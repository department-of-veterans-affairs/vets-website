import { selectPatientFacilities } from '~/platform/user/cerner-dsot/selectors';

/**
 * Determines if a user has health data. This is done by determining if a
 * user has been assigned to one or more facilitites
 *
 * @param {Object} state Current redux state
 * @returns {Boolean} Returns true if the user has health data, false otherwise
 */
export const hasHealthData = state => {
  const facilities = selectPatientFacilities(state) || [];
  return facilities.length > 0;
};
