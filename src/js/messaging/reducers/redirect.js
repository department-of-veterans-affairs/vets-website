import {
  DELETE_COMPOSE_MESSAGE,
  DELETE_MESSAGE_SUCCESS,
  MOVE_MESSAGE_SUCCESS,
  RESET_REDIRECT,
  SAVE_DRAFT_SUCCESS,
  SEND_MESSAGE_SUCCESS
} from '../utils/constants';

const initialState = false;

export default function redirect(state = initialState, action) {
  switch (action.type) {
    case DELETE_COMPOSE_MESSAGE:
    case DELETE_MESSAGE_SUCCESS:
    case MOVE_MESSAGE_SUCCESS:
    case SAVE_DRAFT_SUCCESS:
    case SEND_MESSAGE_SUCCESS: {
      return true;
    }

    /* FAILURE */
    // return { redirect: false };

    case RESET_REDIRECT:
      return false;

    default:
      return state;
  }
}
