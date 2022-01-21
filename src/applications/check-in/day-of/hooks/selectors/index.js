import { createSelector } from 'reselect';

const selectCheckInData = createSelector(
  state => state.checkInData,
  checkInData => checkInData || {},
);

const makeSelectCheckInData = () => selectCheckInData;

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

const selectAppointmentListData = createSelector(
  state => {
    return {
      context: state.checkInData?.context,
      appointments: state.checkInData?.appointments,
    };
  },
  data => (data.context || data.appointments ? data : {}),
);

const makeSelectAppointmentListData = () => selectAppointmentListData;

const selectContext = createSelector(
  state => state.checkInData?.context,
  context => context || {},
);

const makeSelectContext = () => selectContext;

const selectSeeStaffMessage = createSelector(
  state => {
    return {
      message: state?.checkInData?.seeStaffMessage,
    };
  },
  message => message,
);

const makeSelectSeeStaffMessage = () => selectSeeStaffMessage;

const selectDemographicData = createSelector(
  state => {
    return {
      demographics: state.checkInData?.demographics,
      nextOfKin: state.checkInData?.nextOfKin,
      emergencyContact: state.checkInData?.emergencyContact,
    };
  },
  data =>
    data.demographics || data.nextOfKin || data.emergencyContact ? data : {},
);

const makeSelectDemographicData = () => selectDemographicData;

export {
  makeSelectCheckInData,
  makeSelectConfirmationData,
  makeSelectAppointmentListData,
  makeSelectContext,
  makeSelectSeeStaffMessage,
  makeSelectDemographicData,
};
