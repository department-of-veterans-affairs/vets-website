import { createSelector } from 'reselect';

import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

const selectFeatureToggles = createSelector(
  state => ({
    isLoadingFeatureFlags: state?.featureToggles?.loading,
    isCheckInEnabled: toggleValues(state)[
      FEATURE_FLAG_NAMES.checkInExperienceEnabled
    ],
    isPreCheckInEnabled: toggleValues(state)[
      FEATURE_FLAG_NAMES.checkInExperiencePreCheckInEnabled
    ],
    isEmergencyContactEnabled: toggleValues(state)[
      FEATURE_FLAG_NAMES.checkInExperienceEmergencyContactEnabled
    ],
    isDemographicsPageEnabled: toggleValues(state)[
      FEATURE_FLAG_NAMES.checkInExperienceDemographicsPageEnabled
    ],
    isNextOfKinEnabled: toggleValues(state)[
      FEATURE_FLAG_NAMES.checkInExperienceNextOfKinEnabled
    ],
    isUpdatePageEnabled: toggleValues(state)[
      FEATURE_FLAG_NAMES.checkInExperienceUpdateInformationPageEnabled
    ],
  }),
  toggles => toggles,
);

const makeSelectFeatureToggles = () => selectFeatureToggles;

export { makeSelectFeatureToggles };
