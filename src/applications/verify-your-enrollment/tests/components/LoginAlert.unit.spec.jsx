import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import LoginAlert from '../../components/LoginAlert';

describe('<LoginAlert/>', () => {
  it('should render without crashing', () => {
    const wrapper = shallow(<LoginAlert />);
    expect(wrapper.exists()).to.be.ok;
    wrapper.unmount();
  });
});
