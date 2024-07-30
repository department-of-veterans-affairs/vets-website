export const selectUserProfile = state =>
  state.user.login.currentlyLoggedIn && state.user.profile;
export const selectUserIsLoading = state => state.user.profile.loading;
export const selectFeatureToggles = state => state.featureToggles;
