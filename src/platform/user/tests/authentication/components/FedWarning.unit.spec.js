import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import FedWarning from 'platform/user/authentication/components/FedWarning';

describe('FedWarning', () => {
  it('should render content as expected', () => {
    const wrapper = shallow(<FedWarning />);
    expect(wrapper.find('h2').text()).to.contains('Terms of use');
    expect(wrapper.find('p').length).to.eql(4);
    wrapper.unmount();
  });
});
