import { CSP_IDS } from '~/platform/user/authentication/constants';
import { signInServiceName } from '~/platform/user/authentication/selectors';
import { isLOA1 } from '~/platform/user/selectors';

/**
 * Determines if the user has an MHV basic account based on being unverfied and
 * being LOA1. This selector returns 'true' when the current user is signed in
 * with the ID.me or Login.gov "Credential Service Provider" and is LOA1.
 *
 * @param {Object} state Current redux state.
 * @returns {Boolean} true if CSP is ID.me or Login.gov and is LOA1
 */

export const hasMhvBasicAccount = state => {
  return [CSP_IDS.MHV].includes(signInServiceName(state)) && isLOA1(state);
};
