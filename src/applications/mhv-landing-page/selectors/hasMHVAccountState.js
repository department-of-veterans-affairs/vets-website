/**
 * Selects the hasMHVAccount state.
 * @param {Object} state The current application state.
 * @returns {boolean} The hasMHVAccount state.
 */

export const selectHasMHVAccountState = state => {
  return ['OK', 'MULTIPLE'].includes(state?.user?.profile?.mhvAccountState);
};
