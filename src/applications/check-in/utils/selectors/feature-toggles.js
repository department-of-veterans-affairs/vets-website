import { createSelector } from 'reselect';

// eslint-disable-next-line import/no-unresolved
import { featureFlagNames } from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
// eslint-disable-next-line import/no-unresolved
import { toggleValues } from '@department-of-veterans-affairs/platform-site-wide/selectors';

const selectFeatureToggles = createSelector(
  state => ({
    isLoadingFeatureFlags: state?.featureToggles?.loading,
    isCheckInEnabled: toggleValues(state)[
      featureFlagNames.checkInExperienceEnabled
    ],
    isPreCheckInEnabled: toggleValues(state)[
      featureFlagNames.checkInExperiencePreCheckInEnabled
    ],
    isTranslationDisclaimerSpanishEnabled: toggleValues(state)[
      featureFlagNames.checkInExperienceTranslationDisclaimerSpanishEnabled
    ],
    isTranslationDisclaimerTagalogEnabled: toggleValues(state)[
      featureFlagNames.checkInExperienceTranslationDisclaimerTagalogEnabled
    ],
    isTravelReimbursementEnabled: toggleValues(state)[
      featureFlagNames.checkInExperienceTravelReimbursement
    ],
    isBrowserMonitoringEnabled: toggleValues(state)[
      featureFlagNames.checkInExperienceBrowserMonitoring
    ],
    isUpdatedApptPresentationEnabled: toggleValues(state)[
      featureFlagNames.checkInExperienceUpdatedApptPresentation
    ],
    isPreCheckInActionLinkTopPlacementEnabled: toggleValues(state)[
      featureFlagNames.checkInExperiencePreCheckInActionLinkTopPlacement
    ],
  }),
  toggles => toggles,
);

const makeSelectFeatureToggles = () => selectFeatureToggles;

export { makeSelectFeatureToggles };
