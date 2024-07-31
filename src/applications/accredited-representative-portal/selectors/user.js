export const selectFeatureToggles = state => state.featureToggles;
export const selectUserIsLoading = state => state.user.profile.loading;
export const selectUserIsLoggedIn = state => state.user.login.currentlyLoggedIn;
export const selectUserProfile = state =>
  selectUserIsLoggedIn(state) && state.user.profile;
