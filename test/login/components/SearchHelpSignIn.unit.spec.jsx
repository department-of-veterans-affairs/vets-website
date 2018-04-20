import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import { merge } from 'lodash/fp';

import SearchHelpSignIn from '../../../src/js/login/components/SearchHelpSignIn.jsx';

const defaultProps = {
  isLoggedIn: false,
  isMenuOpen: {
    account: false,
    help: false,
    search: false
  },
  isUserRegisteredForBeta: () => {},
  profile: {
    email: 'test@vets.gov',
    loading: false,
    userFullName: {
      first: 'Test'
    }
  },
  toggleLoginModal: () => {},
  toggleMenu: () => {}
};

describe('<SearchHelpSignIn>', () => {
  beforeEach(() => {
    global.sessionStorage = {};
    global.window = {
      location: {
        replace: () => {},
      }
    };
    global.window.location.pathname = '/';
  });

  it('should render', () => {
    const tree =  SkinDeep.shallowRender(
      <SearchHelpSignIn {...defaultProps}/>
    );
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });

  it('should present login links when not logged in', () => {
    const tree =  SkinDeep.shallowRender(
      <SearchHelpSignIn {...defaultProps}/>
    );
    const link = tree.everySubTree('.sign-in-link');
    expect(link).to.have.lengthOf(2);
  });

  it('should render <SignInProfileMenu/> when currentlyLoggedIn is true', () => {
    const signedInProps = merge(defaultProps, { isLoggedIn: true });
    const tree = SkinDeep.shallowRender(<SearchHelpSignIn {...signedInProps}/>);
    const profileMenu = tree.everySubTree('SignInProfileMenu');
    expect(profileMenu).to.have.lengthOf(1);
  });

  it('should display email for an LOA1 user without a firstname', () => {
    const loa1Props = merge(defaultProps, {
      isLoggedIn: true,
      profile: {
        userFullName: { first: null }
      }
    });
    const tree = SkinDeep.shallowRender(
      <SearchHelpSignIn {...loa1Props}/>
    );
    const dropDownElement = tree.dive(['SignInProfileMenu', 'DropDown']);
    expect(dropDownElement.text()).to.contain(defaultProps.profile.email);
  });
});
