import { createSelector } from 'reselect';

import { preCheckInExperienceEnabled, loadingFeatureFlags } from './selectors';

const selectFeatureToggles = createSelector(
  state => ({
    isPreCheckInEnabled: preCheckInExperienceEnabled(state),
    isLoadingFeatureFlags: loadingFeatureFlags(state),
  }),
  toggles => toggles,
);

const makeSelectFeatureToggles = () => selectFeatureToggles;

export { makeSelectFeatureToggles };
