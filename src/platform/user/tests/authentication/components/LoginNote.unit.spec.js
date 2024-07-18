import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import LoginNote from 'platform/user/authentication/components/LoginNote';

describe('LoginNote', () => {
  it('renders LoginNote component', () => {
    const wrapper = shallow(<LoginNote />);
    expect(wrapper.find('LoginNote').exists()).to.be.true;
    wrapper.unmount();
  });
});
