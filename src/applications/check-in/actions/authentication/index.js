export const SET_SESSION = 'SET_SESSION';

// test grouped app builds
export const createSetSession = ({ token, permissions }) => {
  return {
    type: SET_SESSION,
    payload: {
      token,
      permissions,
    },
  };
};
