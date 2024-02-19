export const selectRumUser = state => {
  const { user, hcaEnrollmentStatus, totalRating } = state;
  const { enrollmentStatus } = hcaEnrollmentStatus;
  const { totalDisabilityRating } = totalRating;
  const {
    profile: {
      loa: { current: currentLOA },
      signIn: { serviceName },
    },
    login: { currentlyLoggedIn },
  } = user;
  return {
    disabilityRating: totalDisabilityRating,
    isSignedIn: currentlyLoggedIn,
    serviceProvider: serviceName,
    loa: currentLOA,
    enrollmentStatus,
  };
};
