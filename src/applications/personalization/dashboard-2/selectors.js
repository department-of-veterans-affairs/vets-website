import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

export const selectShowDashboard2 = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.dashboardShowDashboard2];
