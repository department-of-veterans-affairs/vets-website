import { createSelector } from 'reselect';

import {
  loadingFeatureFlags,
  checkInExperiencePreCheckInEnabled,
} from './selectors';

const selectFeatureToggles = createSelector(
  state => ({
    isLoadingFeatureFlags: loadingFeatureFlags(state),
    isPreCheckInEnabled: checkInExperiencePreCheckInEnabled(state),
  }),
  toggles => toggles,
);

const makeSelectFeatureToggles = () => selectFeatureToggles;

const selectForm = createSelector(
  state => state.preCheckInData,
  data => data.form,
);

const makeSelectForm = () => selectForm;

export { makeSelectFeatureToggles, makeSelectForm };
