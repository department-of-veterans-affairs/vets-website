import {
  isLOA1,
  isLOA3,
  isLoggedIn,
  isProfileLoading,
} from '~/platform/user/selectors';

/**
 * Map state values to create selector for user authentication properties
 * @param {Object} state - the current state values
 * @returns {Object} - authentication properties to use in components
 */
export const selectAuthStatus = state => ({
  isUserLOA1: isLOA1(state),
  isUserLOA3: isLOA3(state),
  isLoggedIn: isLoggedIn(state),
  isLoadingProfile: isProfileLoading(state),
});
