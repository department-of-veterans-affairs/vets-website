// common selectors for redux state used throughout Profile and Dashboard/MyVA

/**
 * The user profile has a claims object that is used to determine what apis should be called
 * This selector returns that claims object
 *
 * @param {*} state Redux state object
 * @returns {Object} Claims object for determining what apis should be called
 */
export const canAccess = state => state.user?.profile?.claims || {};
