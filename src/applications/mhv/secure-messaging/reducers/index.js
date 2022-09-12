import {
  MESSAGES_RETRIEVE_STARTED,
  MESSAGES_RETRIEVE_SUCCEEDED,
  MESSAGES_RETRIEVE_FAILED,
  MESSAGE_RETRIEVE_STARTED,
  MESSAGE_RETRIEVE_SUCCEEDED,
  MESSAGE_RETRIEVE_FAILED,
  MESSAGE_DELETE_STARTED,
  MESSAGE_DELETE_FAILED,
  MESSAGE_DELETE_SUCCEEDED,
  LOADING_COMPLETE,
} from '../actions';

const initialState = {
  isLoading: true,
  messages: null,
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
    case MESSAGE_DELETE_STARTED:
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
    case MESSAGE_DELETE_FAILED:
    case MESSAGE_RETRIEVE_FAILED:
      return {
        ...state,
        isLoading: false,
        error: action.response,
      };
    case MESSAGE_DELETE_SUCCEEDED:
    case LOADING_COMPLETE:
      return {
        ...state,
        isLoading: false,
      };

    default:
      return state;
  }
};
export default { allMessages, message };
