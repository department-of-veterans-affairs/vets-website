/* eslint-disable @department-of-veterans-affairs/use-workspace-imports */
import { createSelector } from 'reselect';

import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

const selectFeatureToggles = createSelector(
  state => ({
    checkInUnifiedExperience: toggleValues(state)[
      FEATURE_FLAG_NAMES.checkInUnifiedExperience
    ],
  }),
  toggles => toggles,
);

const makeSelectFeatureToggles = () => selectFeatureToggles;

export { makeSelectFeatureToggles };
