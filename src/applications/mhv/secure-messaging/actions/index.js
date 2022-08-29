/*
Redux action that handles API calls. Currently mocked, but the imports needed are 
below whenever sandbox environments for local dev are set up. 

This is also where GA events may be fired for successful / unsuccessful api calls
*/

// import recordEvent from 'platform/monitoring/record-event';
// import { apiRequest } from 'platform/utilities/api';
import allMessages from '../tests/fixtures/messages-response.json';
import messageDraft from '../tests/fixtures/message-draft-response.json';

export const MESSAGES_RETRIEVE_STARTED = 'MESSAGES_RETRIEVE_STARTED';
export const MESSAGES_RETRIEVE_SUCCEEDED = 'MESSAGES_RETRIEVE_SUCCEEDED';
export const MESSAGES_RETRIEVE_FAILED = 'MESSAGES_RETRIEVE_FAILED';

export const MESSAGE_RETRIEVE_STARTED = 'MESSAGE_RETRIEVE_STARTED';
export const MESSAGE_RETRIEVE_SUCCEEDED = 'MESSAGE_RETRIEVE_SUCCEEDED';
export const MESSAGE_RETRIEVE_FAILED = 'MESSAGE_RETRIEVE_FAILED';

export const LOADING_COMPLETE = 'LOADING_COMPLETE';

// const SECURE_MESSAGES_URI = '/mhv/messages';

const mockDataRequest = (request, messageId) => {
  return new Promise(resolve => {
    setTimeout(() => {
      if (request === 'messages') resolve(allMessages);
      if (request === 'draft') {
        if (+messageDraft.id === +messageId) {
          resolve(messageDraft);
        } else {
          resolve({ errors: ['message not found'] });
        }
      }
    }, 1500);
  });
};

const retrieveData = async (request, messageId) => {
  try {
    // replace with apiRequest when endpoint is ready
    return await mockDataRequest(request, messageId);
  } catch (error) {
    return error;
  }
};

export const getAllMessages = () => async dispatch => {
  dispatch({ type: MESSAGES_RETRIEVE_STARTED });

  const response = await retrieveData('messages');
  if (response.errors) {
    // handles errors and dispatch error action
    // fire GA event for error
    const error = response.errors[0];
    dispatch({
      type: MESSAGES_RETRIEVE_FAILED,
      response: error,
    });
  } else {
    // dispatch success action and GA event
    dispatch({
      type: MESSAGES_RETRIEVE_SUCCEEDED,
      response,
    });
  }
};

export const getMessage = messageId => async dispatch => {
  dispatch({ type: MESSAGE_RETRIEVE_STARTED });

  const response = await retrieveData('draft', messageId);
  if (response.errors) {
    // handles errors and dispatch error action
    // fire GA event for error
    const error = response.errors[0];
    dispatch({
      type: MESSAGE_RETRIEVE_FAILED,
      response: error,
    });
  } else {
    // dispatch success action and GA event
    dispatch({
      type: MESSAGE_RETRIEVE_SUCCEEDED,
      response,
    });
  }
};

export const loadingComplete = () => async dispatch => {
  dispatch({ type: LOADING_COMPLETE });
};
