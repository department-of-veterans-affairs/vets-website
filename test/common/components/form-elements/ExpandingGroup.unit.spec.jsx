import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import ExpandingGroup from '../../../../src/js/common/components/form-elements/ExpandingGroup';


describe('<ExpandingGroup>', () => {
  it('has sane looking features', () => {
    const tree = SkinDeep.shallowRender(<ExpandingGroup open><first/><second/></ExpandingGroup>);
    expect(tree.everySubTree('first')).to.have.lengthOf(1);
    expect(tree.everySubTree('second')).to.have.lengthOf(1);
  });

  it('hides second child when closed', () => {
    const tree = SkinDeep.shallowRender(<ExpandingGroup><first/><second/></ExpandingGroup>);
    expect(tree.everySubTree('first')).to.have.lengthOf(1);
    expect(tree.everySubTree('second')).to.have.lengthOf(0);
  });
});
