import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';

export const mcpFeatureToggle = state => {
  return toggleValues(state)[FEATURE_FLAG_NAMES.showMedicalCopays];
};
