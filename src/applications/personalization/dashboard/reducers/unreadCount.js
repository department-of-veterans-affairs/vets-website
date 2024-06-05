import {
  LOADING_UNREAD_MESSAGES_COUNT,
  FETCH_UNREAD_MESSAGES_COUNT_SUCCESS,
  FETCH_UNREAD_MESSAGES_COUNT_ERROR,
} from '../actions/messaging';

const initialState = {
  count: null,
  errors: null,
  loading: false,
};

export default function unreadCount(state = initialState, action) {
  switch (action.type) {
    case LOADING_UNREAD_MESSAGES_COUNT: {
      return {
        count: null,
        errors: null,
        loading: true,
      };
    }

    case FETCH_UNREAD_MESSAGES_COUNT_SUCCESS: {
      return {
        count: action.unreadMessagesCount,
        errors: null,
        loading: false,
      };
    }

    case FETCH_UNREAD_MESSAGES_COUNT_ERROR: {
      return {
        count: null,
        errors: action.errors,
        loading: false,
      };
    }

    default:
      return state;
  }
}
