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
    isTranslationDisclaimerSpanishEnabled: toggleValues(state)[
      FEATURE_FLAG_NAMES.checkInExperienceTranslationDisclaimerSpanishEnabled
    ],
    isTranslationDisclaimerTagalogEnabled: toggleValues(state)[
      FEATURE_FLAG_NAMES.checkInExperienceTranslationDisclaimerTagalogEnabled
    ],
    isTravelReimbursementEnabled: toggleValues(state)[
      FEATURE_FLAG_NAMES.checkInExperienceTravelReimbursement
    ],
    isTravelLogicEnabled: toggleValues(state)[
      FEATURE_FLAG_NAMES.checkInExperienceTravelLogic
    ],
    isBrowserMonitoringEnabled: toggleValues(state)[
      FEATURE_FLAG_NAMES.checkInExperienceBrowserMonitoring
    ],
    isUnifiedLandingPageEnabled: toggleValues(state)[
      FEATURE_FLAG_NAMES.checkInExperienceUnifiedLandingPage
    ],
  }),
  toggles => toggles,
);

const makeSelectFeatureToggles = () => selectFeatureToggles;

export { makeSelectFeatureToggles };
