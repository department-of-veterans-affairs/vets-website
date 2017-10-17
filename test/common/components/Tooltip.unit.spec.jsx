import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import Tooltip from '../../../src/js/common/components/Tooltip';

describe('<Tooltip>', () => {
  it('should render trigger text', () => {
    const tree = SkinDeep.shallowRender(
      <Tooltip text="Testing text">Blah</Tooltip>
    );

    expect(tree.toString()).to.contain('Testing text');
    expect(tree.subTree('ExpandingGroup').props.open).to.be.false;
  });

  it('should set ExpandingGroup to open when tip is open', () => {
    const tree = SkinDeep.shallowRender(
      <Tooltip text="Testing text">Blah</Tooltip>
    );

    tree.getMountedInstance().toggle();

    expect(tree.subTree('ExpandingGroup').props.open).to.be.true;
  });
});
