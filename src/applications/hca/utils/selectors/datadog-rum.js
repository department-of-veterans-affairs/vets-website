export const selectRumUser = state => {
  const { user, hcaEnrollmentStatus, disabilityRating } = state;
  const { statusCode } = hcaEnrollmentStatus;
  const { totalRating } = disabilityRating;
  const {
    profile: { loa, signIn },
    login: { currentlyLoggedIn },
  } = user;
  return {
    disabilityRating: totalRating,
    isSignedIn: currentlyLoggedIn,
    serviceProvider: signIn?.serviceName,
    loa: loa?.current,
    enrollmentStatus: statusCode,
  };
};
