export const SET_SESSION = 'SET_SESSION';

// Trigger grouped app build
export const createSetSession = ({ token, permissions }) => {
  return {
    type: SET_SESSION,
    payload: {
      token,
      permissions,
    },
  };
};
