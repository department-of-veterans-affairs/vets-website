import { expect } from 'chai';
import React from 'react';
import SkinDeep from 'skin-deep';
import FolderHeader from '../../../components/MessageList/FolderHeader';
import folders from '../../fixtures/folder-inbox-response.json';
import { DefaultFolders as Folder } from '../../../util/constants';

describe('FolderHeader component in Inbox', () => {
  const tree = SkinDeep.shallowRender(<FolderHeader folder={folders.inbox} />);
  it('must display valid folder name', () => {
    expect(tree.subTree('h1').text()).to.equal(Folder.INBOX.header);
  });

  it('must display valid folder description', () => {
    expect(tree.text()).to.contain(Folder.INBOX.desc);
  });
  it('must display Compose message link', () => {
    expect(tree.text()).to.contain('Compose message');
  });
});

describe('FolderHeader component in Sent folder', () => {
  const tree = SkinDeep.shallowRender(<FolderHeader folder={folders.sent} />);
  it('must display valid folder name', () => {
    expect(tree.subTree('h1').text()).to.equal(Folder.SENT.header);
  });

  it('must display valid folder description', () => {
    expect(tree.text()).to.contain(Folder.SENT.desc);
  });

  it('must NOT display Compose message link', () => {
    expect(tree.subTree('Link')).is.not.rendered;
  });
});

describe('FolderHeader component in Drafts folder', () => {
  const tree = SkinDeep.shallowRender(<FolderHeader folder={folders.drafts} />);
  it('must display valid folder name', () => {
    expect(tree.subTree('h1').text()).to.equal(Folder.DRAFTS.header);
  });

  it('must display valid folder description', () => {
    expect(tree.text()).to.contain(Folder.DRAFTS.desc);
  });

  it('must NOT display Compose message link', () => {
    expect(tree.subTree('Link')).is.not.rendered;
  });
});

describe('FolderHeader component in Trash folder', () => {
  const tree = SkinDeep.shallowRender(<FolderHeader folder={folders.trash} />);
  it('must display valid folder name', () => {
    expect(tree.subTree('h1').text()).to.equal(Folder.DELETED.header);
  });

  it('must display valid folder description', () => {
    expect(tree.text()).to.contain(Folder.DELETED.desc);
  });

  it('must NOT display Compose message link', () => {
    expect(tree.subTree('Link')).is.not.rendered;
  });
});
