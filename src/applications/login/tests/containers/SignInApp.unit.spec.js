import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { SignInPage } from 'applications/login/containers/SignInApp';
import AutoSSO from 'platform/site-wide/user-nav/containers/AutoSSO';
import { LoginContainer } from 'platform/user/authentication/components';
import sinon from 'sinon';
import { EXTERNAL_APPS } from 'platform/user/authentication/constants';

const loggedOutProp = { propName: 'loggedOut', expectedValue: true };
const applicationProp = {
  propName: 'externalApplication',
  expectedValue: EXTERNAL_APPS.MHV,
};
const isUnifiedSignInProp = {
  propName: 'isUnifiedSignIn',
  expectedValue: true,
};

const defaultProps = {
  location: {
    query: {},
  },
};

describe('SignInApp', () => {
  it('should render AutoSSO and LoginContainer by default', () => {
    const component = shallow(<SignInPage {...defaultProps} />);
    expect(component.exists(AutoSSO)).to.be.true;
    expect(component.exists(LoginContainer)).to.be.true;
    component.unmount();
  });

  it('should set LoginContainer prop `isUnifiedSignIn` to true', () => {
    const component = shallow(<SignInPage {...defaultProps} />);
    expect(component.find(LoginContainer).prop(isUnifiedSignInProp.propName)).to
      .be.true;
    component.unmount();
  });

  it('should correctly add loggedOut prop to LoginContainer when ?auth=logged_out', () => {
    defaultProps.location.query = { auth: 'logged_out' };
    const component = shallow(<SignInPage {...defaultProps} />);
    expect(
      component.find(LoginContainer).prop(loggedOutProp.propName),
    ).to.equal(loggedOutProp.expectedValue);
    component.unmount();
  });

  it('should correctly add externalApplication prop to LoginContainer when ?application=mhv', () => {
    defaultProps.location.query = { application: 'mhv' };
    const component = shallow(<SignInPage {...defaultProps} />);
    expect(
      component.find(LoginContainer).prop(applicationProp.propName),
    ).to.equal(applicationProp.expectedValue);
    component.unmount();
  });

  it('should redirect to verify page when logging into an unverified cerner account', () => {
    const routerPushSpy = sinon.spy();
    defaultProps.location.query = { application: EXTERNAL_APPS.MY_VA_HEALTH };
    defaultProps.router = { push: routerPushSpy };
    defaultProps.authenticatedWithSSOe = true;
    defaultProps.profile = {};

    const component = shallow(<SignInPage {...defaultProps} />);
    component.setProps({ profile: { verified: false } });
    expect(routerPushSpy.calledOnce).to.be.true;
    expect(routerPushSpy.args[0][0]).to.contain('/verify');
    component.unmount();
  });
});
