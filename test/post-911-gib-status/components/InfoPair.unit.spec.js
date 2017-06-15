import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import InfoPair from '../../../src/js/post-911-gib-status/components/InfoPair.jsx'

const props = {
  label: 'Item',
  value: 3
};

describe('<InfoPair>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<InfoPair {...props}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });

  // should render key-value pair when value is truthy

  // should not render when value is faley
});
