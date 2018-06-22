import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import data from '../../data.json';

import MenuSection from '../../components/MenuSection.jsx';

describe('<MenuSection>', () => {
  const props = {
    data,
    title: 'Health Care',
    updateCurrentSection: () => {},
  };

  const tree = SkinDeep.shallowRender(<MenuSection {...props}/>);

  it('should render', () => {
    const vdom = tree.getRenderOutput();

    expect(vdom).to.not.be.undefined;
  });
});
