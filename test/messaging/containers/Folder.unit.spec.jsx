import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import { Folder } from '../../../src/js/messaging/containers/Folder';

const props = {
  attributes: {
    folderId: 0,
    name: 'Inbox'
  },
  filter: {},
  folders: new Map([
    ['inbox', {}],
    ['drafts', {}],
    ['sent', {}],
    ['deleted', {}],
    ['personal-folder', {}],
  ]),
  loading: {
    folder: false
  },
  messages: [
    { body: 'test1' },
    { body: 'test2' },
    { body: 'test3' },
    { body: 'test4' },
    { body: 'test5' }
  ],
  moveToId: null,
  pagination: {
    currentPage: 1,
    perPage: 10,
    totalEntries: 5,
    totalPages: 1
  },
  params: { folderName: 'inbox' },
  redirect: null,
  searchParams: {},
  sort: {
    value: 'sentDate',
    order: 'DESC'
  },

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
