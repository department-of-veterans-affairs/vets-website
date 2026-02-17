import { createSelector } from 'reselect';
import { toggleValues } from '@department-of-veterans-affairs/platform-site-wide/selectors';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';

const selectFeatureToggles = createSelector(
  state => ({
    isLoadingFeatureFlags: state?.featureToggles?.loading,
    isBrowserMonitoringEnabled:
      toggleValues(state)[FEATURE_FLAG_NAMES.ezrBrowserMonitoringEnabled],
    isUploadEnabled: toggleValues(state)[FEATURE_FLAG_NAMES.ezrUploadEnabled],
    isEmergencyContactsEnabled:
      toggleValues(state)[FEATURE_FLAG_NAMES.ezrEmergencyContactsEnabled],
  }),
  toggles => toggles,
);

const makeSelectFeatureToggles = () => selectFeatureToggles;

export { makeSelectFeatureToggles };
