export const UPDATE_LOCATION_STATE = 'UPDATE_LOCATION_STATE';

export const updateLocationState = state => {
  return {
    type: UPDATE_LOCATION_STATE,
    payload: state,
  };
};

export const RESET_LOCATION_STATE = 'RESET_LOCATION_STATE';

export const resetLocationState = () => {
  return {
    type: RESET_LOCATION_STATE,
  };
};
