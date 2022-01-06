import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import AboutThisTool from '../../../components/content/AboutThisTool';

describe('<AboutThisTool>', () => {
  it('should render', () => {
    const wrapper = shallow(<AboutThisTool />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });
});
