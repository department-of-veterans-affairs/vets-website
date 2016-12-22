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
  isAdvancedVisible: false,
  lastRequestedFolder: null,
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
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<Folder {...props}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });

  it('should show a loading screen', () => {
    const tree = SkinDeep.shallowRender(
      <Folder {...props } loading={{ folder: true }}/>
    );
    expect(tree.subTree('LoadingIndicator')).to.not.be.false;
    expect(tree.subTree('MessageSearch')).to.be.false;
    expect(tree.subTree('MessageNav')).to.be.false;
    expect(tree.subTree('SortableTable')).to.be.false;
  });

  it('should show an error message without a reload', () => {
    const tree = SkinDeep.shallowRender(
      <Folder {...props } attributes={{}}/>
    );
    expect(tree.subTree('.msg-loading-error')).to.not.be.false;
    expect(tree.subTree('.msg-reload')).to.be.false;
    expect(tree.subTree('MessageSearch')).to.be.false;
    expect(tree.subTree('MessageNav')).to.be.false;
    expect(tree.subTree('SortableTable')).to.be.false;
  });

  it('should show an error message with a reload', () => {
    const tree = SkinDeep.shallowRender(
      <Folder
          {...props }
          attributes={{}}
          lastRequestedFolder={{ id: 0, query: {} }}/>
    );
    expect(tree.subTree('.msg-loading-error')).to.not.be.false;
    expect(tree.subTree('.msg-reload')).to.be.not.be.false;
    expect(tree.subTree('MessageSearch')).to.be.false;
    expect(tree.subTree('MessageNav')).to.be.false;
    expect(tree.subTree('SortableTable')).to.be.false;
  });

  it('should say that there are no messages in the folder', () => {
    const tree = SkinDeep.shallowRender(
      <Folder
          {...props }
          filter={undefined}
          messages={[]}
          pagination={{
            currentPage: 1,
            perPage: 10,
            totalPages: 1,
            totalEntries: 0
          }}/>
    );
    expect(tree.subTree('.msg-nomessages')).to.not.be.false;
    expect(tree.subTree('MessageSearch')).to.be.false;
    expect(tree.subTree('MessageNav')).to.be.false;
    expect(tree.subTree('SortableTable')).to.be.false;
  });

  it('should say that no messages were found through search', () => {
    const tree = SkinDeep.shallowRender(
      <Folder
          {...props }
          filter={{ subject: { match: 'no match' } }}
          messages={[]}
          pagination={{
            currentPage: 1,
            perPage: 10,
            totalPages: 1,
            totalEntries: 0
          }}/>
    );
    expect(tree.subTree('.msg-nomessages')).to.not.be.false;
    expect(tree.subTree('MessageSearch')).to.not.be.false;
    expect(tree.subTree('MessageNav')).to.be.false;
    expect(tree.subTree('SortableTable')).to.be.false;
  });

  it('should show folder controls', () => {
    const tree = SkinDeep.shallowRender(
      <Folder {...props }/>
    );
    expect(tree.subTree('ComposeButton')).to.not.be.false;
    expect(tree.subTree('MessageSearch')).to.not.be.false;
    expect(tree.subTree('MessageNav')).to.not.be.false;
  });
});
