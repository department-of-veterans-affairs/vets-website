export const SET_SESSION = 'SET_SESSION';

// testing changed app build
export const createSetSession = ({ token, permissions }) => {
  return {
    type: SET_SESSION,
    payload: {
      token,
      permissions,
    },
  };
};
