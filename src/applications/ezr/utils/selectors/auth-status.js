import { isLOA3, isLoggedIn, isProfileLoading } from 'platform/user/selectors';

/**
 * Map state values to create selector for user authentication properties
 * @param {Object} state - the current state values
 * @returns {Object} - authentication properties to use in components
 */
export function selectAuthStatus(state) {
  const isLoggedOut = !isProfileLoading(state) && !isLoggedIn(state);
  return {
    isUserLOA3: !isLoggedOut && isLOA3(state),
    isLoggedOut,
  };
}
