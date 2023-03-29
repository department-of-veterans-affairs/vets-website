import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

const selectFeatureToggle = state => {
  return toggleValues(state)[FEATURE_FLAG_NAMES.btsssLoginWidget];
};

export { selectFeatureToggle };
