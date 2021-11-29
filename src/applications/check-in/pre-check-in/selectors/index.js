import { createSelector } from 'reselect';

import {
  loadingFeatureFlags,
  checkInExperiencePreCheckInEnabled,
} from './selectors';

const selectCurrentContext = createSelector(
  state => state.preCheckInData,
  data => data.context,
);

const makeSelectCurrentContext = () => selectCurrentContext;

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

export { makeSelectCurrentContext, makeSelectFeatureToggles, makeSelectForm };
