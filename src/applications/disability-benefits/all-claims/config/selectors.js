// import the toggleValues helper
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';

export const uploadPdfLimitFeature = state =>
  toggleValues(state).evss_upload_limit_150mb;
