import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import GenderFilter from '../../../components/search/GenderFilter';

describe('<CautionFlagHeading>', () => {
  it('renders', () => {
    const wrapper = shallow(<GenderFilter />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });

  it('renders with passed in property selected', () => {
    const wrapper = shallow(<GenderFilter gender="menonly" />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });
});
