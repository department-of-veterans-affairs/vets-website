import { CSP_IDS } from '~/platform/user/authentication/constants';
import { signInServiceName } from '~/platform/user/authentication/selectors';
import { isLOA3 } from '~/platform/user/selectors';

/**
 * Determines if the VerifyAndRegisterAlert component should be shown. This
 *   selector returns 'true' when the current user is signed in with the ID.me
 *   or Login.gov "Credential Service Provider" with unverified (non-LOA3)
 *   credentials.
 * @param {Object} state Current redux state.
 * @returns {Boolean} true if CSP is ID.me or Login.gov and not LOA3
 */
export const showVerifyAndRegisterAlert = state =>
  [CSP_IDS.ID_ME, CSP_IDS.LOGIN_GOV].includes(signInServiceName(state)) &&
  !isLOA3(state);
