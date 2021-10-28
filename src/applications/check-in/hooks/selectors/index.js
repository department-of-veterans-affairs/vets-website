import { createSelector } from 'reselect';

import {
  checkInExperienceEnabled,
  checkInExperienceDemographicsPageEnabled,
  checkInExperienceNextOfKinEnabled,
  checkInExperienceUpdateInformationPageEnabled,
  loadingFeatureFlags,
} from '../../selectors';

const selectCheckInData = createSelector(
  state => state.checkInData,
  checkInData => checkInData || {},
);

const makeSelectCheckInData = () => selectCheckInData;

const selectFeatureToggles = createSelector(
  state => ({
    isCheckInEnabled: checkInExperienceEnabled(state),
    isDemographicsPageEnabled: checkInExperienceDemographicsPageEnabled(state),
    isLoadingFeatureFlags: loadingFeatureFlags(state),
    isNextOfKinEnabled: checkInExperienceNextOfKinEnabled(state),
    isUpdatePageEnabled: checkInExperienceUpdateInformationPageEnabled(state),
  }),
  toggles => toggles || {},
);

const makeSelectFeatureToggles = () => selectFeatureToggles;

export {
  selectCheckInData,
  makeSelectCheckInData,
  selectFeatureToggles,
  makeSelectFeatureToggles,
};
