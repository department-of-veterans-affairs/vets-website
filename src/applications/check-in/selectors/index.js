import { createSelector } from 'reselect';

const selectCurrentContext = createSelector(
  state => state.checkInData,
  data => data.context,
);

const makeSelectCurrentContext = () => selectCurrentContext;

const selectForm = createSelector(
  state => state.checkInData,
  data => data.form,
);

const makeSelectForm = () => selectForm;

const selectVeteranData = createSelector(
  state => state.checkInData,
  data => ({
    appointments: data.appointments,
    demographics: data.veteranData.demographics,
  }),
);

const makeSelectVeteranData = () => selectVeteranData;

const selectConfirmationData = createSelector(
  state => {
    return {
      appointments: state.checkInData?.appointments,
      selectedAppointment: state.checkInData?.context?.appointment,
    };
  },
  data => (data.appointments || data.selectedAppointment ? data : {}),
);

const makeSelectConfirmationData = () => selectConfirmationData;

const selectSeeStaffMessage = createSelector(
  state => {
    return {
      message: state?.checkInData?.seeStaffMessage,
    };
  },
  message => message,
);

const makeSelectSeeStaffMessage = () => selectSeeStaffMessage;

const selectApp = createSelector(
  state => {
    return {
      app: state?.checkInData?.app,
    };
  },
  app => app,
);

const makeSelectApp = () => selectApp;

export {
  makeSelectCurrentContext,
  makeSelectForm,
  makeSelectVeteranData,
  makeSelectConfirmationData,
  makeSelectSeeStaffMessage,
  makeSelectApp,
};
