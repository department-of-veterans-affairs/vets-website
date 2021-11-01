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

const selectConfirmationData = createSelector(
  state => {
    return {
      appointments: state.checkInData.appointments,
      selectedAppointment: state.checkInData.context.appointment,
    };
  },
  data => data || {},
);

const makeSelectConfirmationData = () => selectConfirmationData;

const selectAppointmentListData = createSelector(
  state => {
    return {
      context: state.checkInData.context,
      appointments: state.checkInData.appointments,
    };
  },
  data => data || {},
);

const makeSelectAppointmentListData = () => selectAppointmentListData;

const selectContext = createSelector(
  state => state.checkInData?.context,
  context => context || {},
);

const makeSelectContext = () => selectContext;

const selectSeeStaffMessage = () =>
  createSelector(state => {
    return {
      message: state?.checkInData?.seeStaffMessage,
    };
  });

const makeSelectSeeStaffMessage = () => selectSeeStaffMessage;

export {
  makeSelectCheckInData,
  makeSelectFeatureToggles,
  makeSelectConfirmationData,
  makeSelectAppointmentListData,
  makeSelectContext,
  makeSelectSeeStaffMessage,
};
