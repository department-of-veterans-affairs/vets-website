/**
 * Selects the hasEdipi state.
 * @param {Object} state The current application state.
 * @returns {boolean} The hasEdipi state.
 */

export const hasEdipi = state => {
  return !!state.user?.profile?.edipi;
};
