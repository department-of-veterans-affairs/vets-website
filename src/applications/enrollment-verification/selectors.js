export const getEVData = state => ({
  isLoggedIn: state?.user?.login?.currentlyLoggedIn || false,
  hasCheckedKeepAlive: state?.user?.login?.hasCheckedKeepAlive || false,
  editMonthVerification: state?.data?.editMonthVerification,
  enrollmentVerification: state?.data?.enrollmentVerification,
  enrollmentVerificationFetchComplete:
    state?.data?.enrollmentVerificationFetchComplete || false,
  enrollmentVerificationFetchFailure:
    state?.data?.enrollmentVerificationFetchFailure || false,
  enrollmentVerificationSubmitted: state?.data?.enrollmentVerificationSubmitted,
  submissionResult: state?.data?.enrollmentVerificationSubmissionResult,
});
