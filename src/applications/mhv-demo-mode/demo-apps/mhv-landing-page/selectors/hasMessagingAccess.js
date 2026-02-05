import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
/**
 * Selects the hasMessagingAccess state.
 * @param {Object} state The current application state.
 * @returns {boolean} The hasMessagingAccess state.
 */

export const hasMessagingAccess = state => {
  return state?.user?.profile?.services.includes(backendServices.MESSAGING);
};
