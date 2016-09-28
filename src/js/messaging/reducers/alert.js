import React from 'react';
import { Link } from 'react-router';

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
        content: <b>Failed to delete message.</b>,
        status: 'error',
        visible: true
      };

    case DELETE_MESSAGE_SUCCESS:
      return {
        content: <b>Your message has been deleted.</b>,
        status: 'success',
        visible: true
      };

    case SAVE_DRAFT_FAILURE:
      return {
        content: <b>Failed to save draft.</b>,
        status: 'error',
        visible: true
      };

    case SAVE_DRAFT_SUCCESS: {
      const id = action.data.data.attributes.messageId;
      const link = (
        <Link to={`/messaging/thread/${id}`}>
          View message.
        </Link>
      );

      return {
        content: <b>Your draft has been saved. {link}</b>,
        status: 'success',
        visible: true
      };
    }

    default:
      return state;
  }
}
