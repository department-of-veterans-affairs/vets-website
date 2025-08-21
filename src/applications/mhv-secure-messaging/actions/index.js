/*
Redux action that handles API calls. Currently mocked, but the imports needed are 
below whenever sandbox environments for local dev are set up. 

This is also where GA events may be fired for successful / unsuccessful api calls
*/

export const MESSAGES_RETRIEVE_STARTED = 'MESSAGES_RETRIEVE_STARTED';
export const MESSAGES_RETRIEVE_SUCCEEDED = 'MESSAGES_RETRIEVE_SUCCEEDED';
export const MESSAGES_RETRIEVE_FAILED = 'MESSAGES_RETRIEVE_FAILED';

export const MESSAGE_MOVE_STARTED = 'MESSAGE_MOVE_STARTED';
export const MESSAGE_MOVE_SUCCEEDED = 'MESSAGE_MOVE_SUCCEEDED';
export const MESSAGE_MOVE_FAILED = 'MESSAGE_MOVE_FAILED';

export const FOLDERS_RETRIEVE_STARTED = 'FOLDERS_RETRIEVE_STARTED';
export const FOLDERS_RETRIEVE_FAILED = 'FOLDERS_RETRIEVE_FAILED';
export const FOLDERS_RETRIEVE_SUCCEEDED = 'FOLDERS_RETRIEVE_SUCCEEDED';

export const THREAD_RETRIEVE_STARTED = 'THREAD_RETRIEVE_STARTED';
export const THREAD_RETRIEVE_SUCCEEDED = 'THREAD_RETRIEVE_SUCCEEDED';
export const THREAD_RETRIEVE_FAILED = 'THREAD_RETRIEVE_FAILED';

export const LOADING_COMPLETE = 'LOADING_COMPLETE';

export const getIsPilotFromState = getState => {
  const state = getState();
  return state.sm?.app?.isPilot ?? false;
};
