import { removeTimeZone } from '../../utils/appointment';

const appointmentWasCheckedIntoHandler = (state, action) => {
  return {
    ...state,
    context: { ...state.context, appointment: action.payload.appointment },
  };
};

const permissionsUpdatedHandler = (state, action) => {
  return {
    ...state,
    context: { ...state.context, scope: action.payload.scope },
  };
};

const setTokenContextHandler = (state, action) => {
  return {
    ...state,
    context: { ...state.context, ...action.payload.context },
  };
};

const triggerRefreshHandler = (state, action) => {
  return {
    ...state,
    context: { ...state.context, ...action.payload.context },
  };
};

const receivedAppointmentDetailsHandler = (state, action) => {
  let payload = JSON.parse(JSON.stringify(action.payload));
  if ('appointments' in payload) {
    payload = removeTimeZone(payload);
  }
  return { ...state, ...payload };
};

const receivedEmergencyContactDataHandler = (state, action) => {
  return { ...state, ...action.payload };
};

const receivedDemographicsDataHandler = (state, action) => {
  return { ...state, ...action.payload };
};

const receivedNextOfKinDataHandler = (state, action) => {
  return { ...state, ...action.payload };
};

const tokenWasValidatedHandler = (state, action) => {
  return { ...state, ...action.payload };
};

const seeStaffMessageUpdatedHandler = (state, action) => {
  return { ...state, ...action.payload };
};

const receivedDemographicsStatusHandler = (state, action) => {
  return { ...state, ...action.payload };
};

export {
  appointmentWasCheckedIntoHandler,
  permissionsUpdatedHandler,
  setTokenContextHandler,
  triggerRefreshHandler,
  receivedAppointmentDetailsHandler,
  receivedEmergencyContactDataHandler,
  receivedDemographicsDataHandler,
  receivedNextOfKinDataHandler,
  tokenWasValidatedHandler,
  seeStaffMessageUpdatedHandler,
  receivedDemographicsStatusHandler,
};
