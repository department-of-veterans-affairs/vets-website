import React from 'react';
import { expect } from 'chai';
import { cleanup } from '@testing-library/react';
import SignInPageContainer from 'applications/login/containers/SignInApp';
import sinon from 'sinon';
import { withRouter } from 'react-router-dom';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';

const generateProps = ({ push = sinon.spy(), query = {} } = {}) => ({
  router: { push },
  location: { query },
});

const defaultMockStore = ({
  isLoggedIn = false,
  sisEnabled = true,
  authBroker = 'sis',
} = {}) => ({
  profile: {
    loading: false,
    session: {
      authBroker,
      ssoe: authBroker !== 'sis',
      transactionid: authBroker !== 'sis' ? 'fake_tx_id' : null,
    },
  },
  user: {
    login: {
      currentlyLoggedIn: isLoggedIn,
      hasCheckedKeepAlive: false,
    },
  },
  featureToggles: {
    signInServiceEnabled: sisEnabled,
    profileHideDirectDepositCompAndPen: false,
  },
});

const SignInPage = withRouter(SignInPageContainer);
const oldLocation = global.window.location;

describe('SignInApp', () => {
  beforeEach(() => {
    global.window.location = new URL('https://dev.va.gov/sign-in/');
  });
  afterEach(() => {
    global.window.location = oldLocation;
    cleanup();
  });

  // it.skip('should set LoginContainer prop `isUnifiedSignIn` to true', () => {
  //   const component = shallow(<SignInPage {...defaultProps} />);
  //   expect(component.find(LoginContainer).prop(isUnifiedSignInProp.propName)).to
  //     .be.true;
  //   component.unmount();
  // });

  // it.skip('should correctly add loggedOut prop to LoginContainer when ?auth=logged_out', () => {
  //   defaultProps.location.query = { auth: 'logged_out' };
  //   const component = shallow(<SignInPage {...defaultProps} />);
  //   expect(
  //     component.find(LoginContainer).prop(loggedOutProp.propName),
  //   ).to.equal(loggedOutProp.expectedValue);
  //   component.unmount();
  // });

  // it.skip('should correctly add externalApplication prop to LoginContainer when ?application=mhv', () => {
  //   defaultProps.location.query = { application: 'mhv' };
  //   const component = shallow(<SignInPage {...defaultProps} />);
  //   expect(
  //     component.find(LoginContainer).prop(applicationProp.propName),
  //   ).to.equal(applicationProp.expectedValue);
  //   component.unmount();
  // });

  // it.skip('should redirect to verify page when logging into an unverified cerner account', () => {
  //   const routerPushSpy = sinon.spy();
  //   defaultProps.location.query = { application: EXTERNAL_APPS.MY_VA_HEALTH };
  //   defaultProps.router = { push: routerPushSpy };
  //   defaultProps.authenticatedWithSSOe = true;
  //   defaultProps.useSignInService = false;
  //   defaultProps.profile = {};

  //   const component = shallow(<SignInPage {...defaultProps} />);
  //   component.setProps({ profile: { verified: false } });
  //   expect(routerPushSpy.calledOnce).to.be.true;
  //   expect(routerPushSpy.args[0][0]).to.contain('/verify');
  //   component.unmount();
  // });

  // it.skip('should append the `?oauth=true` parameter if useSignInService is true and oauth=true is not already appended and application is undefined', () => {
  //   const routerPushSpy = sinon.spy();
  //   defaultProps.location.query = { oauth: true };
  //   defaultProps.router = { push: routerPushSpy };
  //   defaultProps.useSignInService = true;

  //   const component = shallow(<SignInPage {...defaultProps} />);
  //   expect(routerPushSpy.calledOnce).to.be.false;

  //   component.setProps({ location: { query: {} } });
  //   expect(routerPushSpy.calledOnce).to.be.true;
  //   expect(routerPushSpy.args[0][0]).to.contain('?oauth=true');
  //   component.unmount();
  // });

  it('should return a user to the homepage if they are authenticated', () => {
    const defaultProps = generateProps();
    const wrapper = renderInReduxProvider(<SignInPage {...defaultProps} />, {
      initialState: defaultMockStore({ isLoggedIn: true }),
      path: '/sign-in/',
    });
    expect(wrapper.getByText(/Sign in/)).to.not.be.null;
    expect(defaultProps.router.push.called).to.be.true;
    expect(global.window.location.toString()).to.not.include('/sign-in');
  });

  it('should add the query `oauth=true` by default', () => {
    const defaultProps = generateProps();
    const wrapper = renderInReduxProvider(<SignInPage {...defaultProps} />, {
      initialState: defaultMockStore({}),
      path: '/sign-in',
    });
    // const link = wrapper.getByText(/Create an account with ID.me/);
    expect(wrapper.getByText(/Sign in/)).to.not.be.null;
    expect(defaultProps.router.push.called).to.be.true;
    expect(defaultProps.router.push.args[0][0].includes('oauth=true'));
    // console.log(link);
  });

  it('should check if the `oauth=false` query is present and not change it', () => {
    const defaultProps = generateProps({ query: { oauth: false } });
    const wrapper = renderInReduxProvider(<SignInPage {...defaultProps} />, {
      initialState: defaultMockStore(),
      path: '/sign-in',
    });
    expect(wrapper.getByText(/Sign in/)).to.not.be.null;
    expect(defaultProps.location.query.oauth).to.be.false;
    // expect(global.window.location.toString()).to.include('oauth=false');
  });

  it('should change `oauth=false` if the `application=<app>` is not OAuth authorized', () => {
    // global.window.location.search = '?oauth=true&application=mhv';
    const defaultProps = generateProps({
      query: { oauth: true, application: 'mhv' },
    });
    const wrapper = renderInReduxProvider(<SignInPage {...defaultProps} />, {
      initialState: defaultMockStore(),
      path: '/sign-in/',
    });
    expect(wrapper.getByText(/Sign in/)).to.not.be.null;
    expect(defaultProps.router.push.args[0][0].includes('?oauth=false'));
    expect(defaultProps.location.query.oauth).to.be.false;
    // console.log(defaultProps.location.query);
    // expect(global.window.location.toString()).to.include('oauth=false');
  });
  it('should stay `oauth=false` when the `sign_in_service_enabled` flipper is false', () => {
    global.window.location.search = '?oauth=true&application=mhv';
    const defaultProps = generateProps();
    const wrapper = renderInReduxProvider(<SignInPage {...defaultProps} />, {
      initialState: defaultMockStore({ sisEnabled: false }),
      path: '/sign-in/?oauth=true&application=mhv',
    });
    expect(wrapper.getByText(/Sign in/)).to.not.be.null;
    expect(defaultProps.router.push.args[0][0].includes('?oauth=false'));
  });
  it('should show a <this> when `auth=logged_out` query is present', async () => {});
});
