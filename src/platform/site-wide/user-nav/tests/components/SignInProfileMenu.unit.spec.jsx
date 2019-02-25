import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import SignInProfileMenu from '../../components/SignInProfileMenu.jsx';

describe('<SignInProfileMenu>', () => {
  const props = {
    clickHandler: () => {},
    disabled: false,
    greeting: 'test.user@va.gov',
    isOpen: false,
  };

  it('should hide the profile menu contents', () => {
    const wrapper = shallow(<SignInProfileMenu {...props} />);
    expect(wrapper.find('#account-menu').prop('isOpen')).to.be.false;
    wrapper.unmount();
  });

  it('should show the profile menu contents', () => {
    const wrapper = shallow(<SignInProfileMenu {...props} isOpen />);
    expect(wrapper.find('#account-menu').prop('isOpen')).to.be.true;
    wrapper.unmount();
  });
});
