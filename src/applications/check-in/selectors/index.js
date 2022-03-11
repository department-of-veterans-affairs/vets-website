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

const selectEditContext = createSelector(
  state => {
    return {
      editing: state?.checkInData?.context?.editing,
    };
  },
  editing => editing,
);

const makeSelectEditContext = () => selectEditContext;

const selectPendingEdits = createSelector(
  state => {
    return {
      pendingEdits: state?.checkInData?.context?.pendingEdits,
    };
  },
  pendingEdits => pendingEdits,
);

const makeSelectPendingEdits = () => selectPendingEdits;

export {
  makeSelectCurrentContext,
  makeSelectEditContext,
  makeSelectForm,
  makeSelectVeteranData,
  makeSelectConfirmationData,
  makeSelectSeeStaffMessage,
  makeSelectApp,
  makeSelectPendingEdits,
};
