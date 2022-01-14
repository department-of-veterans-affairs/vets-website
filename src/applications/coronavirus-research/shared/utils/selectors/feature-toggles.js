import { createSelector } from 'reselect';

import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

const selectFeatureToggles = createSelector(
  state => ({
    isLoadingFeatureFlags: state?.featureToggles?.loading,
    isCovidVaccineTrialsIntakeEnabled: toggleValues(state)[
      FEATURE_FLAG_NAMES.covidVolunteerIntakeEnabled
    ],
    isCovidVaccineTrialsUpdateEnabled: toggleValues(state)[
      FEATURE_FLAG_NAMES.covidVolunteerUpdateEnabled
    ],
  }),
  toggles => toggles,
);

const makeSelectFeatureToggles = () => selectFeatureToggles;

export { makeSelectFeatureToggles };
