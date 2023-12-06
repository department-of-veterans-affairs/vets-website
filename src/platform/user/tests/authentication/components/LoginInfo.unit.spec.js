import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import LoginInfo from 'platform/user/authentication/components/LoginInfo';

describe('LoginInfo', () => {
  it('renders SubmitSignInForm component', () => {
    const wrapper = shallow(<LoginInfo />);
    expect(wrapper.find('SubmitSignInForm').exists()).to.be.true;
    expect(wrapper.find('SubmitSignInForm').prop('startSentence')).to.be.true;
    wrapper.unmount();
  });
  it('anchor tags send users to appropriate place', () => {
    const wrapper = shallow(<LoginInfo />);

    const signInTag = wrapper.find('a').at(0);
    const verifyIdentityTag = wrapper.find('a').at(1);

    expect(signInTag.prop('href')).to.eql('/resources/signing-in-to-vagov/');
    expect(verifyIdentityTag.prop('href')).to.eql(
      '/resources/verifying-your-identity-on-vagov/',
    );
    expect([signInTag.prop('target'), verifyIdentityTag.prop('target')]).to.eql(
      ['_blank', '_blank'],
    );
    wrapper.unmount();
  });
});
