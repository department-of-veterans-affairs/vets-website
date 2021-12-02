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

const selectVeteranData = createSelector(
  state => state.preCheckInData,
  data => ({
    appointments: data.appointments,
    demographics: data.veteranData.demographics,
  }),
);

const makeSelectVeteranData = () => selectVeteranData;

export {
  makeSelectCurrentContext,
  makeSelectFeatureToggles,
  makeSelectForm,
  makeSelectVeteranData,
};
