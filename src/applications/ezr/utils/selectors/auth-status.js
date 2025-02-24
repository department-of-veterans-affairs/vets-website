import {
  isLOA1,
  isLOA3,
  isLoggedIn,
  isProfileLoading,
} from 'platform/user/selectors';

/**
 * Map state values to create selector for user authentication properties
 * @param {Object} state - the current state values
 * @returns {Object} - authentication properties to use in components
 */
export function selectAuthStatus(state) {
  // Mock auth status in development
  if (process.env.NODE_ENV === 'development') {
    return {
      isUserLOA1: false,
      isUserLOA3: true,
      isLoggedOut: false,
    };
  }

  const isLoggedOut = !isProfileLoading(state) && !isLoggedIn(state);
  return {
    isUserLOA1: !isLoggedOut && isLOA1(state),
    isUserLOA3: !isLoggedOut && isLOA3(state),
    isLoggedOut,
  };
}
