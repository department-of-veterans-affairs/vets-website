import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import { BlueButtonApp } from '../../../src/js/blue-button/containers/BlueButtonApp';

const props = {
  modal: {
    content: '',
    title: '',
    visible: false
  },
  closeModal: () => {}
};

describe('<BlueButtonApp>', () => {
  const tree = SkinDeep.shallowRender(<BlueButtonApp {...props}/>);

  it('should render', () => {
    const vdom = tree.getRenderOutput();
    expect(vdom).to.exist;
  });
});

