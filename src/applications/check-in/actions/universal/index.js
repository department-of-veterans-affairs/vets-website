export const SET_APP = 'SET_APP';

export const setApp = application => {
  return {
    type: SET_APP,
    payload: { app: application },
  };
};
