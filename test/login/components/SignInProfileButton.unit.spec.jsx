import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import { SignInProfileButton } from '../../../src/js/login/components/SignInProfileButton.jsx';

describe('<SignInProfileButton>', () => {
  const loginData = {
    currentlyLoggedIn: false,
    loginUrl: ''
  };

  let tree = SkinDeep.shallowRender(<SignInProfileButton login={loginData}/>);

  it('should render', () => {
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });

  it('should present login link when currentlyLoggedIn is false', () => {
    const link = tree.everySubTree('a');
    expect(link).to.have.lengthOf(1);
  });

  it('should present profile and sign out buttons when currentlyLoggedIn is true', () => {
    const signedInData = { currentlyLoggedIn: true, loginUrl: '' };
    const profileData = { email: 'fake@aol.com' };
    tree = SkinDeep.shallowRender(<SignInProfileButton login={signedInData} profile={profileData}/>);
    const link = tree.everySubTree('a');
    expect(link).to.have.lengthOf(2);
  });
});
