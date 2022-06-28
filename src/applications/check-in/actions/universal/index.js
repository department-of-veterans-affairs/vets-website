export const SET_APP = 'SET_APP';

export const setApp = application => {
  return {
    type: SET_APP,
    payload: { app: application },
  };
};

export const RECORD_ANSWER = 'RECORD_ANSWER';

export const recordAnswer = answer => {
  return {
    type: RECORD_ANSWER,
    payload: answer,
  };
};
