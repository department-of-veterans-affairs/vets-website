import { expect } from 'chai';

import { makeField } from '../../../src/js/common/model/fields';
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
  it('should reset thread while loading', () => {
    const state = messagesReducer({
      data: {
        message: 'message4',
        thread: ['message1', 'message2', 'message3'],
        draft: {
          attachments: ['file1', 'file2'],
          body: makeField('Lorem ipsum dolor sit amet.'),
          category: makeField('Medication'),
          recipient: makeField('Clinician'),
          subject: makeField('Prescription Request')
        }
      },
      ui: {
        formVisible: true,
        lastRequestedId: 123,
        messagesCollapsed: new Set([12, 34, 56]),
        moveToOpened: true,
        replyDetailsCollapsed: false
      }
    }, {
      type: LOADING_THREAD,
      messageId: 456
    });

    expect(state.data.message).to.be.null;
    expect(state.data.thread).to.be.empty;

    const { attachments, body, category, recipient, subject } = state.data.draft;

    expect(attachments).to.be.empty;
    expect(body.value).to.be.empty;
    expect(category.value).to.be.empty;
    expect(recipient.value).to.be.empty;
    expect(subject.value).to.be.empty;

    const {
      formVisible,
      lastRequestedId,
      messagesCollapsed,
      moveToOpened,
      replyDetailsCollapsed
    } = state.ui;

    expect(formVisible).to.be.false;
    expect(lastRequestedId).to.equal(456);
    expect(messagesCollapsed.size).to.equal(0);
    expect(moveToOpened).to.be.false;
    expect(replyDetailsCollapsed).to.be.true;
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

  it('should clear the draft', () => {
    const state = messagesReducer({
      data: {
        draft: {
          attachments: ['file1'],
          body: makeField('Lorem ipsum dolor sit amet.'),
          category: makeField('Medication'),
          recipient: makeField('Clinician'),
          subject: makeField('Prescription Request')
        }
      }
    }, {
      type: CLEAR_DRAFT
    });
    const { attachments, body, category, recipient, subject } = state.data.draft;
    expect(attachments).to.be.empty;
    expect(body.value).to.be.empty;
    expect(category.value).to.equal('Medication');
    expect(recipient.value).to.equal('Clinician');
    expect(subject.value).to.equal('Prescription Request');
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
