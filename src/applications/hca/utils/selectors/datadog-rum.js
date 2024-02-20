export const selectRumUser = state => {
  const { user, hcaEnrollmentStatus, totalRating } = state;
  const { enrollmentStatus } = hcaEnrollmentStatus;
  const { totalDisabilityRating } = totalRating;
  const {
    profile: { loa, signIn },
    login: { currentlyLoggedIn },
  } = user;
  return {
    disabilityRating: totalDisabilityRating,
    isSignedIn: currentlyLoggedIn,
    serviceProvider: signIn?.serviceName,
    loa: loa?.current,
    enrollmentStatus,
  };
};
