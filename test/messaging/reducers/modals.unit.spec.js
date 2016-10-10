import { expect } from 'chai';

import { makeField } from '../../../src/js/common/model/fields';
import { composeMessage } from '../../../src/js/messaging/config';
import modalsReducer from '../../../src/js/messaging/reducers/modals';

import {
  CLOSE_ATTACHMENTS_MODAL,
  CLOSE_CREATE_FOLDER,
  OPEN_ATTACHMENTS_MODAL,
  TOGGLE_CONFIRM_DELETE
} from '../../../src/js/messaging/utils/constants';

describe('modals reducer', () => {
  const initialState = {
    deleteConfirm: {
      visible: false
    },
    attachments: {
      visible: false,
      message: {
        title: null,
        text: null
      }
    },
    createFolder: {
      visible: false,
      newFolderName: makeField('')
    }
  };

  it('should open and close the delete confirmation modal', () => {
    let newState = modalsReducer(initialState, { type: TOGGLE_CONFIRM_DELETE });
    expect(newState.deleteConfirm.visible).to.be.true;
    newState = modalsReducer(newState, { type: TOGGLE_CONFIRM_DELETE });
    expect(newState.deleteConfirm.visible).to.be.false;
  });

  it('should open an error modal for attachments that are too big', () => {
    const newState = modalsReducer(initialState, {
      type: OPEN_ATTACHMENTS_MODAL,
      error: { type: 'tooLarge' }
    });
    expect(newState.attachments.visible).to.be.true;
    expect(newState.attachments.message)
      .to.eql(composeMessage.errors.attachments['tooLarge']);
  });

  it('should open an error modal for too many attachments', () => {
    const newState = modalsReducer(initialState, {
      type: OPEN_ATTACHMENTS_MODAL,
      error: { type: 'tooMany' }
    });
    expect(newState.attachments.visible).to.be.true;
    expect(newState.attachments.message)
      .to.eql(composeMessage.errors.attachments['tooMany']);
  });

  it('should close the attachments error modal', () => {
    const state = { attachments: { visible: true } };
    const newState = modalsReducer(state, { type: CLOSE_ATTACHMENTS_MODAL });
    expect(newState.attachments).to.eql(initialState.attachments);
  });

  it('should close the create folder modal', () => {
    const state = { attachments: { visible: true } };
    const newState = modalsReducer(state, { type: CLOSE_CREATE_FOLDER });
    expect(newState.createFolder).to.eql(initialState.createFolder);
  });
});
