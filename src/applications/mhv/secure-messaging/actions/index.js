// import recordEvent from 'platform/monitoring/record-event';
// import { apiRequest } from 'platform/utilities/api';

export const MESSAGES_RETREIVE_STARTED = 'MESSAGES_RETREIVE_STARTED';
export const MESSAGES_RETREIVE_SUCCEEDED = 'MESSAGES_RETREIVE_STARTED';
export const MESSAGES_RETREIVE_FAILED = 'MESSAGES_RETREIVE_STARTED';

// const SECURE_MESSAGES_URI = '/mhv/messages';

const mockMessages = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ data: {} });
    }, 1500);
  });
};

const retrieveMessages = async () => {
  try {
    // replace with apiRequest when endpoint is ready
    const response = await mockMessages();
    return response.data;
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
      response: response.data,
    });
  }
};
