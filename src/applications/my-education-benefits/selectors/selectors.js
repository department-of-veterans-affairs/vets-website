import {
  isLOA1 as isLOA1Selector,
  isLOA3 as isLOA3Selector,
} from 'platform/user/selectors';
import environments from 'platform/utilities/environment';

export const getAppData = state => ({
  eligibility: state.data?.eligibility,
  formId: state?.form?.formId,
  isClaimantCallComplete: state.data?.personalInfoFetchComplete,
  isEligibilityCallComplete: state.data?.eligibilityFetchComplete,
  isLOA1: isLOA1Selector(state),
  isLOA3: isLOA3Selector(state),
  savedForms: state?.user?.profile?.savedForms,
  showUnverifiedUserAlert: !environments.isProduction(),
  user: state.user || {},
});
