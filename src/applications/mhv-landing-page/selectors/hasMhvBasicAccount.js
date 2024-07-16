import { isLOA1 } from '~/platform/user/selectors';
import { hasMhvAccount } from './hasMhvAccount';

/**
 * Selects the hasMHVBasicAccount state based on user being LOA1 and having an MHV account.
 * @param {Object} state The current application state.
 * @returns {boolean} The hasMHVBasicAccount state.
 */

export const hasMhvBasicAccount = state => {
  return isLOA1(state) && hasMhvAccount(state);
};
