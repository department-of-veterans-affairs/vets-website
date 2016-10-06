import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import { composeMessage } from '../../../src/js/messaging/config';
import { Thread } from '../../../src/js/messaging/containers/Thread';

const props = {
  draft: {
    body: '',
    charsRemaining: composeMessage.maxChars.message
  },
  folders: [],
  folderMessages: [],
  isNewMessage: false,
  isSavedDraft: false,
  message: null,
  messagesCollapsed: new Set(),
  modals: {
    createFolderModal: {},
    deleteConfirm: {}
  },
  moveToOpened: false,
  persistFolder: 0,
  thread: [],

  // No-op function to override dispatch
  dispatch: () => {}
};

describe('Thread', () => {
  const tree = SkinDeep.shallowRender(<Thread {...props}/>);

  it('should render', () => {
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });
});
