import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import MobileFilterControls from '../../components/MobileFilterControls';

describe('<MobileFilterControls/>', () => {
  it('should render', () => {
    const wrapper = shallow(<MobileFilterControls />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });
});
