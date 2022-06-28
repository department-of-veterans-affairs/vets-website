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
    isEditingDayOfEnabled: toggleValues(state)[
      FEATURE_FLAG_NAMES.checkInExperienceEditingDayOfEnabled
    ],
    isEditingPreCheckInEnabled: toggleValues(state)[
      FEATURE_FLAG_NAMES.checkInExperienceEditingPreCheckInEnabled
    ],
    isTranslationDayOfEnabled: toggleValues(state)[
      FEATURE_FLAG_NAMES.checkInExperienceTranslationDayOfEnabled
    ],
    isTranslationPreCheckInEnabled: toggleValues(state)[
      FEATURE_FLAG_NAMES.checkInExperienceTranslationPreCheckInEnabled
    ],
    isTranslationDisclaimerSpanishEnabled: toggleValues(state)[
      FEATURE_FLAG_NAMES.checkInExperienceTranslationDisclaimerSpanishEnabled
    ],
    isDayOfDemographicsFlagsEnabled: toggleValues(state)[
      FEATURE_FLAG_NAMES.checkInExperienceDayOfDemographicsFlagsEnabled
    ],
    isLorotaSecurityUpdatesEnabled: toggleValues(state)[
      FEATURE_FLAG_NAMES.checkInExperienceLorotaSecurityUpdatesEnabled
    ],
    isEditMessagingEnabled: toggleValues(state)[
      FEATURE_FLAG_NAMES.checkInExperienceEditMessagingEnabled
    ],
    isPhoneAppointmentsEnabled: toggleValues(state)[
      FEATURE_FLAG_NAMES.checkInExperiencePhoneAppointmentsEnabled
    ],
  }),
  toggles => toggles,
);

const makeSelectFeatureToggles = () => selectFeatureToggles;

export { makeSelectFeatureToggles };
