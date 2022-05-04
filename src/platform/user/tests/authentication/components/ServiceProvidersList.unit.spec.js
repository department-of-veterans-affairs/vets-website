import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import ServiceProvidersList from 'platform/user/authentication/components/ServiceProvidersList';

describe('ServiceProvidersList', () => {
  it('should render content as expected', () => {
    const wrapper = shallow(<ServiceProvidersList />);
    expect(wrapper.find('p').text()).to.contains(
      `If you don’t have one of these accounts, you can create a free Login.gov or ID.me account.`,
    );
    expect(wrapper.find('li').length).to.eql(4);
    wrapper.unmount();
  });
});
