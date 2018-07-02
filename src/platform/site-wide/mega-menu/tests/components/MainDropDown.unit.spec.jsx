import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import data from '../../data.json';

import { MainDropDown } from '../../components/MainDropDown.jsx';

describe('<MainDropDown>', () => {
  const props = {
    handleOnClick: () => {},
    title: 'Health Care',
    currentDropdown: '',
    currentSection: '',
    data,
    updateCurrentSection: () => {},
  };

  const tree = SkinDeep.shallowRender(<MainDropDown {...props}/>);

  it('should render', () => {
    const vdom = tree.getRenderOutput();

    expect(vdom).to.not.be.undefined;
  });
});
