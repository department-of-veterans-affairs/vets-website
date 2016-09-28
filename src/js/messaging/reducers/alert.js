import {
  DELETE_MESSAGE_FAILURE,
  DELETE_MESSAGE_SUCCESS,
  SAVE_DRAFT_FAILURE,
  SAVE_DRAFT_SUCCESS
} from '../actions/messages';

import {
  CLOSE_ALERT,
  OPEN_ALERT
} from '../actions/alert';

const initialState = {
  content: '',
  status: 'info',
  visible: false
};

export default function alert(state = initialState, action) {
  switch (action.type) {
    case CLOSE_ALERT:
      return {
        content: '',
        status: 'info',
        visible: false
      };

    case OPEN_ALERT:
      return {
        content: action.content,
        status: action.status,
        visible: true
      };

    case DELETE_MESSAGE_FAILURE:
      return {
        content: 'Failed to delete message.',
        status: 'success',
        visible: true
      };

    case DELETE_MESSAGE_SUCCESS:
      return {
        content: 'Your message has been deleted.',
        status: 'success',
        visible: true
      };

    case SAVE_DRAFT_FAILURE:
      return {
        content: 'Failed to save draft.',
        status: 'error',
        visible: true
      };

    case SAVE_DRAFT_SUCCESS:
      return {
        content: 'Your draft has been saved. View message',
        status: 'success',
        visible: true
      };

    default:
      return state;
  }
}
