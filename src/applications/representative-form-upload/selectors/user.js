export const selectIsUserLoading = state => state.user.profile.loading;
export const selectIsUserLoggedIn = state => state.user.login.currentlyLoggedIn;
export const selectUserProfile = state =>
  selectIsUserLoggedIn(state) ? state.user.profile : null;
