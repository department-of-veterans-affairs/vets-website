import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import IconWithInfo from '../../components/IconWithInfo';

describe('<IconWithInfo/>', () => {
  it('should render', () => {
    const wrapper = shallow(<IconWithInfo />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });
});
