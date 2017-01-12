import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import ModalCreateFolder from '../../../src/js/messaging/components/ModalCreateFolder.jsx';

const props = {
  cssClass: '',
  folders: [],
  newFolderName: {
    value: '',
  },
  id: 0,
  loading: false,
  onClose: () => {},
  onSubmit: () => {},
  onValueChange: () => {},
  visible: true,
};

describe('<ModalCreateFolder>', () => {
  it('should render correctly', () => {
    const tree = SkinDeep.shallowRender(
      <ModalCreateFolder {...props}/>
    );

    expect(tree.getRenderOutput()).to.exist;
  });

  it('should render expected output', () => {
    const tree = SkinDeep.shallowRender(
      <ModalCreateFolder {...props}/>
    );
    expect(tree.subTree('Modal')).to.exist;
    expect(tree.subTree('form')).to.exist;
    expect(tree.subTree('.va-modal-button-group')).to.exist;
  });

  it('should show loading indicator when loading', () => {
    const tree = SkinDeep.shallowRender(
      <ModalCreateFolder {...{ ...props, loading: true }}/>
    );
    expect(tree.subTree('LoadingIndicator')).to.exist;
  });
});
