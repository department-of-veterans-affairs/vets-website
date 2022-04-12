import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import LoginHeader from 'platform/user/authentication/components/LoginHeader';

describe('LoginHeader', () => {
  let wrapper;
  const props = { loggedOut: false, isIOS: () => false };

  beforeEach(() => {
    wrapper = shallow(<LoginHeader {...props} />);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('should render', () => {
    expect(wrapper.exists()).to.be.true;
    expect(wrapper.find('h1').text()).to.include('Sign in');
  });
  it('should render a `LogoutAlert` if loggedOut is true', () => {
    expect(wrapper.find('LogoutAlert').exists()).to.be.false;
    wrapper.setProps({ loggedOut: true });
    expect(wrapper.find('LogoutAlert').exists()).to.be.true;
  });
  it('should render `DowntimeBanners`', () => {
    expect(wrapper.find('DowntimeBanners').exists()).to.be.true;
  });
  it('should display an informational alert for iOS users', () => {
    const mutatedProps = { loggedOut: false, isIOS: () => true };
    wrapper = shallow(<LoginHeader {...mutatedProps} />);
    expect(wrapper.find('#ios-bug').exists()).to.be.true;
    wrapper.unmount();
  });
});
