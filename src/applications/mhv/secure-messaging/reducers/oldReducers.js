import {
  MESSAGES_RETRIEVE_STARTED,
  MESSAGES_RETRIEVE_SUCCEEDED,
  MESSAGES_RETRIEVE_FAILED,
  MESSAGE_MOVE_STARTED,
  MESSAGE_MOVE_SUCCEEDED,
  MESSAGE_MOVE_FAILED,
  FOLDERS_RETRIEVE_STARTED,
  FOLDERS_RETRIEVE_FAILED,
  FOLDERS_RETRIEVE_SUCCEEDED,
  // THREAD_RETRIEVE_STARTED,
  THREAD_RETRIEVE_SUCCEEDED,
  THREAD_RETRIEVE_FAILED,
} from '../actions';

const initialState = {
  isLoading: true,
  messages: null,
  folders: null,
  message: null,
  error: null,
  isSaving: false,
  lastSaveTime: null,
  saveError: null,
};

const allMessages = (state = initialState, action) => {
  switch (action.type) {
    case MESSAGES_RETRIEVE_STARTED:
      return {
        ...state,
        isLoading: true,
      };
    case MESSAGES_RETRIEVE_SUCCEEDED:
      return {
        ...state,
        isLoading: false,
        messages: action.response,
      };
    case MESSAGES_RETRIEVE_FAILED:
      return {
        ...state,
        isLoading: false,
        error: action.response,
      };
    default:
      return state;
  }
};

const message = (state = initialState, action) => {
  switch (action.type) {
    case MESSAGE_MOVE_STARTED:
      return {
        ...state,
        isLoading: true,
      };
    case MESSAGE_MOVE_FAILED:
      return {
        ...state,
        isLoading: false,
        error: action.response,
      };
    case MESSAGE_MOVE_SUCCEEDED:
    case THREAD_RETRIEVE_SUCCEEDED:
      return {
        ...state,
        messages: action.response,
      };
    case THREAD_RETRIEVE_FAILED:
      return {
        ...state,
        messages: false,
        error: action.response,
      };
    default:
      return state;
  }
};

const folders = (state = initialState, action) => {
  switch (action.type) {
    case FOLDERS_RETRIEVE_STARTED:
      return {
        ...state,
        isLoading: true,
      };
    case FOLDERS_RETRIEVE_SUCCEEDED:
      return {
        ...state,
        isLoading: false,
        folders: action.response,
      };
    case FOLDERS_RETRIEVE_FAILED:
      return {
        ...state,
        isLoading: false,
        error: action.response,
      };
    default:
      return state;
  }
};

export { allMessages, message, folders };
