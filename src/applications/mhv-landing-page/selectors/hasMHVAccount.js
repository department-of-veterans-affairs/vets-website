/**
 * Selects whether the user has an MHV account.
 * @param {Object} state The current redux state
 * @returns {Boolean} True if the user has an MHV account, false otherwise
 */

export const hasMHVAccount = state => {
  return ['OK', 'MULTIPLE'].includes(state.user.profile.mhvAccountState);
};
