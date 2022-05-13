import {
  MESSAGES_RETREIVE_STARTED,
  MESSAGES_RETREIVE_SUCCEEDED,
  MESSAGES_RETREIVE_FAILED,
} from '../actions';

const initialState = {
  isLoading: true,
  messages: null,
  error: null,
};

const allMessages = (state = initialState, action) => {
  switch (action.type) {
    case MESSAGES_RETREIVE_STARTED:
      return {
        ...state,
        isLoading: true,
      };
    case MESSAGES_RETREIVE_SUCCEEDED:
      return {
        ...state,
        isLoading: false,
        messages: action.response,
      };
    case MESSAGES_RETREIVE_FAILED:
      return {
        ...state,
        isLoading: false,
        error: action.response,
      };
    default:
      return state;
  }
};
export default { allMessages };
