import { datadogRum } from '@datadog/browser-rum';
import {
  isLoggedIn,
  selectProfile,
} from '@department-of-veterans-affairs/platform-user/selectors';
import { noESRRecordFound, selectEnrollmentStatus } from '../selectors';

/**
 * Generate the Datadog RUM user config
 * @param {Object} state - application state containing user data
 * @returns null
 */
export const rumUserConfig = state => {
  return {
    disabilityRating: state.totalRating,
    isSignedIn: isLoggedIn(state),
    loa: selectProfile(state).loa.current,
    serviceName: selectProfile(state).signIn?.serviceName,
    ESRRecordNotFound: noESRRecordFound(state),
    enrollmentStatus: selectEnrollmentStatus(state).enrollmentStatus,
  };
};

/**
 * Set the user object for the Datadog RUM User config
 * @param {Object} state - application state containing user data
 * @returns null
 */
export function setDatadogRUMUserConfig(state) {
  datadogRum.setUser(rumUserConfig(state));
}
