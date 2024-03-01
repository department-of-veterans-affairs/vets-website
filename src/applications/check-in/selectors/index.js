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

const selectError = createSelector(
  state => {
    return {
      error: state?.checkInData?.error,
    };
  },
  app => app,
);

const makeSelectError = () => selectError;

const selectTravelClaimData = createSelector(
  state => state.checkInData,
  data => data.appointments,
);

const makeSelectTravelClaimData = () => selectTravelClaimData;

const selectVeteranAddress = createSelector(
  state => state.checkInData,
  data => data.veteranData.address,
);

const makeSelectVeteranAddress = () => selectVeteranAddress;

export {
  makeSelectCurrentContext,
  makeSelectForm,
  makeSelectVeteranData,
  makeSelectSeeStaffMessage,
  makeSelectApp,
  makeSelectError,
  makeSelectTravelClaimData,
  makeSelectVeteranAddress,
};
