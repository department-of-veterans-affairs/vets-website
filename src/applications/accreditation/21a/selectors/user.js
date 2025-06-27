import { isLOA1, isLOA3 } from 'platform/user/selectors';

export const selectIsUserLoading = state => state.user.profile.loading;
export const selectIsUserLoggedIn = state => state.user.login.currentlyLoggedIn;
export const selectUserProfile = state =>
  selectIsUserLoggedIn(state) ? state.user.profile : null;

export function selectAuthStatus(state) {
  const isLoggedOut =
    !state.user.login.currentlyLoggedIn && !state.user.profile.loading;

  return {
    isUserLOA1: !isLoggedOut && isLOA1(state),
    isUserLOA3: !isLoggedOut && isLOA3(state),
    isLoggedOut,
  };
}
