import { removeTimeZone } from '../../utils/appointment';

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

const receivedDemographicsDataHandler = (state, action) => {
  return {
    ...state,
    veteranData: { demographics: action.payload.demographics },
  };
};

const seeStaffMessageUpdatedHandler = (state, action) => {
  return { ...state, ...action.payload };
};

const additionalContextHandler = (state, action) => {
  return {
    ...state,
    context: { ...state.context, ...action.payload.context },
  };
};

export {
  triggerRefreshHandler,
  receivedAppointmentDetailsHandler,
  receivedDemographicsDataHandler,
  seeStaffMessageUpdatedHandler,
  additionalContextHandler,
};
