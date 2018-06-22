import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import data from '../../data.json';

import SubMenu from '../../components/SubMenu.jsx';

describe('<SubMenu>', () => {
  const props = {
    data: { ...data[0].menuSections[0] },
  };

  const tree = SkinDeep.shallowRender(<SubMenu {...props}/>);

  it('should render', () => {
    const vdom = tree.getRenderOutput();

    expect(vdom).to.not.be.undefined;
  });
});
