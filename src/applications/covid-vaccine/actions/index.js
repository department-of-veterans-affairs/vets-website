import { mockLocations } from './mockData';

export const GET_LOCATIONS_STARTED = 'GET_LOCATIONS_STARTED';
export const GET_LOCATIONS_FAILED = 'GET_LOCATIONS_FAILED';
export const GET_LOCATIONS_SUCCEEDED = 'GET_LOCATIONS_SUCCEEDED';

const getLocations = () => async dispatch => {
  dispatch({ type: GET_LOCATIONS_STARTED });
  const response = mockLocations;
  if (response.errors) {
    dispatch({ type: GET_LOCATIONS_FAILED, response: 'error' });
  } else {
    dispatch({ type: GET_LOCATIONS_SUCCEEDED, response });
  }
};

export default {
  getLocations,
};
