// selectors for the `authorization686` state

export const get686AuthorizationState = (state) => {
  const isLoggedIn = state.user.login.currentlyLoggedIn;
  const isVerified = state.user.profile.verified;
  const hasUserError = !isLoggedIn || !isVerified;

  return {
    disabilityStatusIsLoading: state.authorization686.isLoading,
    isAuthorized: !hasUserError && state.authorization686.isAuthorized,
    isLoading: state.user.profile.loading || state.authorization686.isLoading,
    isLoggedIn,
    isVerified,
    profileIsLoading: state.user.profile.loading,
    profileStatus: state.user.profile.status,
  };
};

