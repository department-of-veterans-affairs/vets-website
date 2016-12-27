import { expect } from 'chai';

import messagesReducer from '../../../src/js/messaging/reducers/messages';

import {
  ADD_DRAFT_ATTACHMENTS,
  CLEAR_DRAFT,
  DELETE_DRAFT_ATTACHMENT,
  FETCH_THREAD_SUCCESS,
  FETCH_THREAD_MESSAGE_SUCCESS,
  LOADING_THREAD,
  TOGGLE_MESSAGE_COLLAPSED,
  TOGGLE_MESSAGES_COLLAPSED,
  TOGGLE_THREAD_MOVE_TO,
  TOGGLE_REPLY_DETAILS,
  TOGGLE_THREAD_FORM,
  UPDATE_DRAFT
} from '../../../src/js/messaging/utils/constants';

describe('messages reducer', () => {
  it('', () => {
    const state = messagesReducer({}, {});
  });

  it('should add draft attachments', () => {
    let state = messagesReducer({
      data: { draft: { attachments: [] } }
    }, {
      type: ADD_DRAFT_ATTACHMENTS,
      files: ['file1']
    });

    expect(state.data.draft.attachments).to.contain('file1');

    state = messagesReducer(state, {
      type: ADD_DRAFT_ATTACHMENTS,
      files: ['file2', 'file3']
    });

    expect(state.data.draft.attachments).to.contain('file1');
    expect(state.data.draft.attachments).to.contain('file2');
    expect(state.data.draft.attachments).to.contain('file3');
  });

  it('should delete draft attachments', () => {
    const state = messagesReducer({
      data: { draft: { attachments: ['file1', 'file2', 'file3'] } }
    }, {
      type: DELETE_DRAFT_ATTACHMENT,
      index: 1
    });

    expect(state.data.draft.attachments).to.have.lengthOf(2);
    expect(state.data.draft.attachments).to.contain('file1');
    expect(state.data.draft.attachments).to.contain('file3');
  });
});
