import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import { makeField } from '../../../src/js/common/model/fields';
import { Main } from '../../../src/js/messaging/containers/Main';

const props = {
  attachmentsModal: {
    message: {
      text: null,
      title: null
    },
    visible: false
  },
  createFolderModal: {
    newFolderName: makeField(''),
    visible: false
  },
  folders: [
  ],
  nav: {
    foldersExpanded: false,
    visible: false
  },
  persistFolder: 0,

  // No-op function to override dispatch
  dispatch: () => {}
};

describe('Main', () => {
  const tree = SkinDeep.shallowRender(<Main {...props}/>);

  it('should render', () => {
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });
});
