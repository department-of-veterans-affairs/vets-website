import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import _ from 'lodash';

import { SearchHelpSignIn } from '../../../src/js/login/components/SearchHelpSignIn.jsx';

const defaultLoginProps = {
  currentlyLoggedIn: false,
  loginUrl: '',
  utilitiesMenuIsOpen: {
    account: false,
    help: false,
    search: false
  }
};

const defaultProfileProps = {
  email: 'fake@aol.com',
  userFullName: {
    first: 'Sharon'
  },
  loading: false,
};

function buildProps(defaultProps, props = {}) {
  return _.merge({}, defaultProps, props);
}

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
      <SearchHelpSignIn onUserLogout={() => {}} login={defaultLoginProps} profile={{ loading: false }}/>
    );
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });

  it('should present login link when currentlyLoggedIn is false', () => {
    const tree =  SkinDeep.shallowRender(
      <SearchHelpSignIn onUserLogout={() => {}} login={defaultLoginProps} profile={{ loading: false }}/>
    );
    const link = tree.everySubTree('a');
    expect(link).to.have.lengthOf(1);
  });

  it('should render <SignInProfileMenu/> when currentlyLoggedIn is true', () => {
    const signedInData = buildProps(defaultLoginProps, { currentlyLoggedIn: true });
    const tree = SkinDeep.shallowRender(<SearchHelpSignIn onUserLogout={() => {}} login={signedInData} profile={defaultProfileProps}/>);
    const profileMenu = tree.everySubTree('SignInProfileMenu');
    expect(profileMenu).to.have.lengthOf(1);
  });

  it('should display email for an LOA1 user without a firstname', () => {
    const loginData = buildProps(defaultLoginProps, { currentlyLoggedIn: true });
    const loa1Profile = buildProps(defaultProfileProps, { userFullName: { first: null, middle: null, last: null } });
    const tree = SkinDeep.shallowRender(
      <SearchHelpSignIn onUserLogout={() => {}} login={loginData} profile={loa1Profile}/>
    );
    const dropDownElement = tree.dive(['SignInProfileMenu', 'DropDown']);
    expect(dropDownElement.text()).to.contain(defaultProfileProps.email);
  });
});
