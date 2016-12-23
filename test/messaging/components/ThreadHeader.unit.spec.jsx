import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import ThreadHeader from '../../../src/js/messaging/components/ThreadHeader';

const props = {
  currentFolder: { name: 'Inbox' },
  currentMessageNumber: 1,
  folderMessageCount: 2,
  folders: [{ folderId: 0, name: 'Inbox' }],
  isNewMessage: false,
  message: { messageId: 123, subject: 'Subject' },
  messagesCollapsed: true,
  moveToIsOpen: false,
  threadMessageCount: 2
};

describe('ThreadHeader', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<ThreadHeader {...props}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });

  it('should show a message nav', () => {
    const tree = SkinDeep.shallowRender(<ThreadHeader {...props }/>);
    expect(tree.subTree('MessageNav')).to.not.be.false;
  });

  it('should show a button to expand or collapse a thread with multiple messages', () => {
    const tree = SkinDeep.shallowRender(<ThreadHeader {...props }/>);
    expect(tree.subTree('ToggleThread')).to.not.be.false;
  });

  it('should not show a button to expand or collapse a thread with only one message', () => {
    const tree = SkinDeep.shallowRender(<ThreadHeader {...props } threadMessageCount={1}/>);
    expect(tree.subTree('ToggleThread')).to.be.false;
  });

  it('should show a delete button', () => {
    const tree = SkinDeep.shallowRender(<ThreadHeader {...props }/>);
    expect(tree.subTree('ButtonDelete')).to.not.be.false;
  });

  it('should not show a delete button for drafts or sent messages', () => {
    let tree = SkinDeep.shallowRender(
      <ThreadHeader
          {...props }
          currentFolder={{ name: 'Drafts' }}/>
    );

    expect(tree.subTree('ButtonDelete')).to.be.false;

    tree = SkinDeep.shallowRender(
      <ThreadHeader
        {...props }
        currentFolder={{ name: 'Sent' }}/>
    );

    expect(tree.subTree('ButtonDelete')).to.be.false;
  });

  it('should show a move button', () => {
    const tree = SkinDeep.shallowRender(<ThreadHeader {...props }/>);
    expect(tree.subTree('MoveTo')).to.not.be.false;
  });

  it('should not show a move button for drafts or sent messages', () => {
    let tree = SkinDeep.shallowRender(
      <ThreadHeader
          {...props }
          currentFolder={{ name: 'Drafts' }}/>
    );

    expect(tree.subTree('MoveTo')).to.be.false;

    tree = SkinDeep.shallowRender(
      <ThreadHeader
          {...props }
          currentFolder={{ name: 'Sent' }}/>
    );

    expect(tree.subTree('MoveTo')).to.be.false;
  });
});
