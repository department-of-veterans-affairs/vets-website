import { expect, assert } from 'chai';
import React from 'react';
import SkinDeep from 'skin-deep';
import FolderHeader from '../../../components/MessageList/FolderHeader';
import folders from '../../fixtures/folder-inbox-response.json';
import { DefaultFolders as Folder, Paths } from '../../../util/constants';

const searchProps = { searchResults: [], awaitingResults: false };
describe('FolderHeader component in Inbox', () => {
  const tree = SkinDeep.shallowRender(
    <FolderHeader folder={folders.inbox} searchProps={{ ...searchProps }} />,
  );

  it('must display valid folder name', async () => {
    const folderHeader = tree.props.children[0];
    const h1 = folderHeader.type;
    const folderName = folderHeader.props.children;
    expect(h1).to.exist;
    assert.equal(folderName, 'Inbox');
  });

  it('must display `Start a new message` link', () => {
    const startANewMessageLink = tree.subTree('ComposeMessageButton').type()
      .props.children;
    assert.equal(startANewMessageLink.props.children[1], 'Start a new message');
    assert.equal(startANewMessageLink.props.to, Paths.COMPOSE);
  });
});

describe('FolderHeader component in Sent folder', () => {
  const tree = SkinDeep.shallowRender(
    <FolderHeader folder={folders.sent} searchProps={{ ...searchProps }} />,
  );
  it('must display valid folder name', () => {
    expect(tree.subTree('h1').text()).to.equal(Folder.SENT.header);
  });

  it('must display valid folder description', () => {
    expect(tree.text()).to.contain(Folder.SENT.desc);
  });

  it('must NOT display `Start a new message` link', () => {
    expect(tree.subTree('Link')).is.not.rendered;
  });
});

describe('FolderHeader component in Drafts folder', () => {
  const tree = SkinDeep.shallowRender(
    <FolderHeader folder={folders.drafts} searchProps={{ ...searchProps }} />,
  );
  it('must display valid folder name', () => {
    expect(tree.subTree('h1').text()).to.equal(Folder.DRAFTS.header);
  });

  it('must display valid folder description', () => {
    expect(tree.text()).to.contain(Folder.DRAFTS.desc);
  });

  it('must NOT display `Start a new message` link', () => {
    expect(tree.subTree('Link')).is.not.rendered;
  });
});

describe('FolderHeader component in Trash folder', () => {
  const tree = SkinDeep.shallowRender(
    <FolderHeader folder={folders.trash} searchProps={{ ...searchProps }} />,
  );
  it('must display valid folder name', () => {
    expect(tree.subTree('h1').text()).to.equal(Folder.DELETED.header);
  });

  it('must display valid folder description', () => {
    expect(tree.text()).to.contain(Folder.DELETED.desc);
  });

  it('must NOT display `Start a new message` link', () => {
    expect(tree.subTree('Link')).is.not.rendered;
  });
});
