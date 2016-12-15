import set from 'lodash/fp/set';

import {
  DELETE_MESSAGE_FAILURE,
  DELETE_MESSAGE_SUCCESS,
  DELETING_MESSAGE,
  FETCH_FOLDER_FAILURE,
  FETCH_FOLDER_SUCCESS,
  FETCH_RECIPIENTS_FAILURE,
  FETCH_RECIPIENTS_SUCCESS,
  FETCH_THREAD_FAILURE,
  FETCH_THREAD_SUCCESS,
  LOADING_FOLDER,
  LOADING_RECIPIENTS,
  LOADING_THREAD,
  MOVE_MESSAGE_FAILURE,
  MOVE_MESSAGE_SUCCESS,
  MOVING_MESSAGE,
  SAVE_DRAFT_FAILURE,
  SAVE_DRAFT_SUCCESS,
  SAVING_DRAFT,
  SEND_MESSAGE_FAILURE,
  SEND_MESSAGE_SUCCESS,
  SENDING_MESSAGE,
} from '../utils/constants';

const initialState = {
  folder: false,
  recipients: false,
  thread: false,
  deleting: false,
  moving: false,
  saving: false,
  sending: false
};

export default function loading(state = initialState, action) {
  switch (action.type) {
    case FETCH_FOLDER_FAILURE:
    case FETCH_FOLDER_SUCCESS:
      return set('folder', false, state);

    case FETCH_RECIPIENTS_FAILURE:
    case FETCH_RECIPIENTS_SUCCESS:
      return set('recipients', false, state);

    case FETCH_THREAD_FAILURE:
    case FETCH_THREAD_SUCCESS:
      return set('thread', false, state);

    case DELETE_MESSAGE_FAILURE:
    case DELETE_MESSAGE_SUCCESS:
      return set('deleting', false, state);

    case MOVE_MESSAGE_FAILURE:
    case MOVE_MESSAGE_SUCCESS:
      return set('moving', false, state);

    case SAVE_DRAFT_FAILURE:
    case SAVE_DRAFT_SUCCESS:
      return set('saving', false, state);

    case SEND_MESSAGE_FAILURE:
    case SEND_MESSAGE_SUCCESS:
      return set('sending', false, state);

    case DELETING_MESSAGE:
      return set('deleting', true, state);

    case LOADING_FOLDER:
      return set('folder', true, state);

    case LOADING_RECIPIENTS:
      return set('recipients', true, state);

    case LOADING_THREAD:
      return set('thread', true, state);

    case MOVING_MESSAGE:
      return set('moving', true, state);

    case SAVING_DRAFT:
      return set('saving', true, state);

    case SENDING_MESSAGE:
      return set('sending', true, state);

    default:
      return state;
  }
}
