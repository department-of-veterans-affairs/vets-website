import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import FolderNav from '../../../src/js/messaging/components/FolderNav.jsx';

const props = {
  currentFolderId: 0,
  folders: [
    {
      count: 3,
      folderId: 0,
      name: 'Inbox',
      systemFolder: true,
      unreadCount: 0
    },
    {
      count: 3,
      folderId: -2,
      name: 'Drafts',
      systemFolder: true,
      unreadCount: 3
    },
  ],
  isExpanded: false,
  onCreateNewFolder: () => {},
  onToggleFolders: () => {},
  toggleFolderNav: () => {},
};

describe('<FolderNav>', () => {
  it('should render correctly', () => {
    const tree = SkinDeep.shallowRender(
      <FolderNav {...props}/>
    );

    expect(tree.getRenderOutput()).to.exist;
  });

  it('should have the expected classname', () => {
    const tree = SkinDeep.shallowRender(
      <FolderNav {...props}/>
    );
    expect(tree.props.className).to.equal('messaging-folder-nav usa-sidenav-list');
  });

  it('should render correct actions', () => {
    const tree = SkinDeep.shallowRender(
      <FolderNav {...props}/>
    );
    expect(tree.subTree('ButtonManageFolders')).to.exist;
    expect(tree.subTree('ButtonCreateFolder')).to.exist;
  });

  it('should the correct number of folders', () => {
    const tree = SkinDeep.shallowRender(
      <FolderNav {...props}/>
    );
    expect(tree.everySubTree('.messaging-folder-nav-link').length).to.equal(2);
  });
});
