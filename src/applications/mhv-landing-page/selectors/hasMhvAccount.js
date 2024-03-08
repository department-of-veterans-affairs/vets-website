/**
 * Selects whether the user has an MHV account based on the terms and conditions being accepted
 * @param {Object} state The current redux state
 * @returns {Boolean} Returns true if the user has an MHV account, false otherwise
 */

export const hasMhvAccount = state =>
  state?.user?.profile?.mhvAccount?.termsAndConditionsAccepted || false;
