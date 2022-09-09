import {
  MESSAGES_RETRIEVE_STARTED,
  MESSAGES_RETRIEVE_SUCCEEDED,
  MESSAGES_RETRIEVE_FAILED,
  MESSAGE_RETRIEVE_STARTED,
  MESSAGE_RETRIEVE_SUCCEEDED,
  MESSAGE_RETRIEVE_FAILED,
  MESSAGE_MOVE_STARTED,
  MESSAGE_MOVE_SUCCEEDED,
  MESSAGE_MOVE_FAILED,
  FOLDERS_RETRIEVE_STARTED,
  FOLDERS_RETRIEVE_FAILED,
  FOLDERS_RETRIEVE_SUCCEEDED,
  LOADING_COMPLETE,
} from '../actions';

const initialState = {
  isLoading: true,
  messages: null,
  folders: null,
  message: null,
  error: null,
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
    case MESSAGE_RETRIEVE_STARTED:
      return {
        ...state,
        isLoading: true,
      };
    case MESSAGE_RETRIEVE_SUCCEEDED:
      return {
        ...state,
        isLoading: false,
        message: action.response,
      };
    case MESSAGE_MOVE_FAILED:
    case MESSAGE_RETRIEVE_FAILED:
      return {
        ...state,
        isLoading: false,
        error: action.response,
      };
    case MESSAGE_MOVE_SUCCEEDED:
    case LOADING_COMPLETE:
      return {
        ...state,
        isLoading: false,
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
export default { allMessages, message, folders };
