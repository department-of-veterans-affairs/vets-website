import { updateForm } from '../../utils/navigation/pre-check-in';

export const SET_SESSION = 'SET_SESSION';

export const createSetSession = ({ token, permissions }) => {
  return {
    type: SET_SESSION,
    payload: {
      token,
      permissions,
    },
  };
};

export const RECORD_ANSWER = 'RECORD_ANSWER';

export const recordAnswer = answer => {
  return {
    type: RECORD_ANSWER,
    payload: answer,
  };
};

export const SET_VETERAN_DATA = 'SET_VETERAN_DATA';

export const setVeteranData = ({ appointments, demographics }) => {
  return {
    type: SET_VETERAN_DATA,
    payload: { appointments, demographics },
  };
};

export const UPDATE_PRE_CHECK_IN_FORM = 'UPDATE_PRE_CHECK_IN_FORM';

export const updateFormAction = ({ patientDemographicsStatus }) => {
  const pages = updateForm(patientDemographicsStatus);
  return {
    type: UPDATE_PRE_CHECK_IN_FORM,
    payload: {
      pages,
    },
  };
};
