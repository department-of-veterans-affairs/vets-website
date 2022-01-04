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
