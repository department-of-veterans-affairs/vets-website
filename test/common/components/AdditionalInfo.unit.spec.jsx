import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import AdditionalInfo from '../../../src/js/common/components/AdditionalInfo';

describe('<AdditionalInfo>', () => {
  it('should render trigger text', () => {
    const tree = SkinDeep.shallowRender(
      <AdditionalInfo triggerText="Testing text">Blah</AdditionalInfo>
    );

    expect(tree.toString()).to.contain('Testing text');
    expect(tree.subTree('ExpandingGroup').props.open).to.be.false;
  });

  it('should set ExpandingGroup to open when explanation is open', () => {
    const tree = SkinDeep.shallowRender(
      <AdditionalInfo triggerText="Testing text">Blah</AdditionalInfo>
    );

    tree.getMountedInstance().toggle();

    expect(tree.subTree('ExpandingGroup').props.open).to.be.true;
  });
});
