import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import { Folder } from '../../../src/js/messaging/containers/Folder';

const props = {
  attributes: {
    folderId: 0,
    name: 'Inbox'
  },
  currentRange: '1 - 5',
  folders: new Map([
    ['inbox', {}],
    ['drafts', {}],
    ['sent', {}],
    ['deleted', {}],
    ['personal-folder', {}],
  ]),
  filter: undefined,
  loading: {
    inProgress: false,
    request: null
  },
  messages: [
    { body: 'test1' },
    { body: 'test2' },
    { body: 'test3' },
    { body: 'test4' },
    { body: 'test5' }
  ],
  messageCount: 5,
  page: 1,
  params: { folderName: 'inbox' },
  sort: {
    value: 'sentDate',
    order: 'DESC'
  },
  totalPages: 1,

  // No-op function to override dispatch
  dispatch: () => {}
};

describe('Folder', () => {
  const tree = SkinDeep.shallowRender(<Folder {...props}/>);

  it('should render', () => {
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });
});
