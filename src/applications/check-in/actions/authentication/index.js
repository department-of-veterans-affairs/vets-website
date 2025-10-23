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
