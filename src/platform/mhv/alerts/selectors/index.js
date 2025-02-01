import { CSP_IDS } from '~/platform/user/authentication/constants';
import {
  isLOA1,
  isLOA3,
  isProfileLoading,
  isVAPatient,
} from '~/platform/user/selectors';
import {
  isAuthenticatedWithSSOe,
  signInServiceName,
} from '~/platform/user/authentication/selectors';

export { isAuthenticatedWithSSOe, signInServiceName, isProfileLoading };

/**
 * Is the user authenticated with a MHV Basic Account?
 *   Returns 'true' when the current user is signed in with the MHV
 *   "Credential Service Provider" and is LOA1.
 * @param {object} state redux state
 * @returns {boolean} true if CSP is MHV and is LOA1
 */
export const showAlertMhvBasicAccount = state =>
  [CSP_IDS.MHV].includes(signInServiceName(state)) && isLOA1(state);

/**
 * Are the user's ID.me/Login.gov authentication credentials unverified?
 *   Returns 'true' when the current user is signed in with the ID.me or
 *   Login.gov "Credential Service Provider" and has unverified (non-LOA3)
 *   credentials.
 * @param {object} state redux state
 * @returns {boolean} true if CSP is ID.me or Login.gov and not LOA3
 */
export const showAlertVerifyAndRegister = state =>
  [CSP_IDS.ID_ME, CSP_IDS.LOGIN_GOV].includes(signInServiceName(state)) &&
  !isLOA3(state);

/**
 * Is the user unverified or unregistered?
 *   Returns 'true' when the current user is signed in with unverified
 *   (non-LOA3) credentials or the user is not registered at a VA treatment
 *   facility.
 * @param {object} state redux state
 * @returns {boolean} true if not LOA3 or not a VA patient
 */
export const showAlertUnregistered = state =>
  !isLOA3(state) || !isVAPatient(state);

/**
 * Does the user have an associated MHV account?
 * @param {object} state redux state
 * @returns {boolean} true if mhvAccountState is 'OK' or 'MULTIPLE'
 */
const hasMhvAccount = state =>
  ['OK', 'MULTIPLE'].includes(state?.user?.profile?.mhvAccountState);

/**
 * Is the user a VA Patient without a MHV account?
 * @param {object} state redux state
 * @returns {boolean} true if LOA3, is a VA Patient, and no MHV account
 */
export const showAlertMhvRegistration = state =>
  isLOA3(state) && isVAPatient(state) && !hasMhvAccount(state);

/**
 * Is state loading for any showAlert* or dependent selectors?
 *   Currently only profile data is being selected by showAlert* selectors.
 * @param {object} state redux state
 * @returns {boolean}
 */
// export const alertsLoading = state => isProfileLoading(state); // || otherDataLoading(state);
