export const selectUser = state => state.user;
export const selectUserProfile = state => selectUser(state)?.profile;
export const selectUserIsLoading = state => selectUserProfile(state)?.loading;
export const selectFeatureToggles = state => state.featureToggles;
