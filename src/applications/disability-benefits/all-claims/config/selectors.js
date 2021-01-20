// import the toggleValues helper
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

export const originalClaimsFeature = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.form526OriginalClaims];

export const form526BDDFeature = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.form526BDD];

export const uploadPdfLimitFeature = state =>
  toggleValues(state).evss_upload_limit_150mb;
