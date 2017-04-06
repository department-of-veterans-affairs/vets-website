import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import { SearchHelpSignIn } from '../../../src/js/login/components/SearchHelpSignIn.jsx';

describe('<SearchHelpSignIn>', () => {
  const loginData = {
    currentlyLoggedIn: false,
    loginUrl: '',
    utilitiesMenuIsOpen: {
      account: false,
      help: false,
      search: false
    }
  };

  let tree = SkinDeep.shallowRender(<SearchHelpSignIn login={loginData}/>);

  it('should render', () => {
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });

  it('should present login link when currentlyLoggedIn is false', () => {
    const link = tree.everySubTree('a');
    expect(link).to.have.lengthOf(2);
  });

  it('should render <SignInProfileMenu/> when currentlyLoggedIn is true', () => {
    const signedInData = {
      currentlyLoggedIn: true,
      loginUrl: '',
      utilitiesMenuIsOpen: {
        account: false,
        help: false,
        search: false
      }
    };
    const profileData = { email: 'fake@aol.com', userFullName: { first: 'Sharon' } };
    tree = SkinDeep.shallowRender(<SearchHelpSignIn login={signedInData} profile={profileData}/>);
    const profileMenu = tree.everySubTree('SignInProfileMenu');
    expect(profileMenu).to.have.lengthOf(1);
  });
});
