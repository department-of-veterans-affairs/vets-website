/*
Redux action that handles API calls. Currently mocked, but the imports needed are 
below whenever sandbox environments for local dev are set up. 

This is also where GA events may be fired for successful / unsuccessful api calls
*/

// import recordEvent from 'platform/monitoring/record-event';
// import { apiRequest } from 'platform/utilities/api';
import mockData from '../tests/fixtures/messages-response.json';

export const MESSAGES_RETREIVE_STARTED = 'MESSAGES_RETREIVE_STARTED';
export const MESSAGES_RETREIVE_SUCCEEDED = 'MESSAGES_RETREIVE_SUCCEEDED';
export const MESSAGES_RETREIVE_FAILED = 'MESSAGES_RETREIVE_FAILED';

// const SECURE_MESSAGES_URI = '/mhv/messages';

const mockMessages = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockData);
    }, 1500);
  });
};

const retrieveMessages = async () => {
  try {
    // replace with apiRequest when endpoint is ready
    return await mockMessages();
  } catch (error) {
    return error;
  }
};

export const getAllMessages = () => async dispatch => {
  dispatch({ type: MESSAGES_RETREIVE_STARTED });

  const response = await retrieveMessages();
  if (response.errors) {
    // handles errors and dispatch error action
    // fire GA event for error
    const error = response.errors[0];
    dispatch({
      type: MESSAGES_RETREIVE_FAILED,
      response: error,
    });
  } else {
    // dispatch success action and GA event
    dispatch({
      type: MESSAGES_RETREIVE_SUCCEEDED,
      response,
    });
  }
};
