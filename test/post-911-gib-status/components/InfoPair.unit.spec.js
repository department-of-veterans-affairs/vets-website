import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import InfoPair from '../../../src/js/post-911-gib-status/components/InfoPair.jsx';

describe('<InfoPair>', () => {
  let props = {
    label: 'Item',
    value: 3
  };
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<InfoPair {...props}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.exist;
  });

  it('should show truthy values', () => {
    const tree = SkinDeep.shallowRender(<InfoPair {...props}/>);
    expect(tree.subTree('span').text()).to.contain('Item');
  });

  it('should not render if value is not passed in', () => {
    props = { label: 'Item' };
    const tree = SkinDeep.shallowRender(<InfoPair {...props}/>);
    expect(tree.subTree('span')).to.be.false;
  });

  it('should not render if value is 0', () => {
    props = {
      label: 'Item',
      value: 0
    };
    const tree = SkinDeep.shallowRender(<InfoPair {...props}/>);
    expect(tree.subTree('span')).to.be.false;
  });
});
