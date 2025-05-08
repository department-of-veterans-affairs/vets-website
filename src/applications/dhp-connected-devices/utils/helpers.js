import { toggleValues } from '@department-of-veterans-affairs/platform-site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';

export const dhpConnectedDevicesFitbitFeature = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.dhpConnectedDevicesFitbit];
