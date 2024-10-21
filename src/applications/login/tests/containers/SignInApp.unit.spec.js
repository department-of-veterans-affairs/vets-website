import React from 'react';
import { expect } from 'chai';
import { cleanup } from '@testing-library/react';
import SignInPage from 'applications/login/containers/SignInApp';
import sinon from 'sinon';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';

const generateProps = ({ push = sinon.spy(), query = {} } = {}) => ({
  router: { push },
  location: {
    key: '', // not with HashHistory!
    pathname: '/sign-in',
    query,
    hash: '',
    state: {},
  },
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

const oldLocation = global.window.location;

describe('SignInApp', () => {
  afterEach(() => {
    cleanup();
  });

  it('should return a user to the homepage if they are authenticated', () => {
    const defaultProps = generateProps({ query: {} });
    global.window.location = new URL('https://dev.va.gov/sign-in/');
    renderInReduxProvider(<SignInPage {...defaultProps} />, {
      initialState: defaultMockStore({
        isLoggedIn: true,
      }),
    });
    expect(defaultProps.router.push.called).to.be.false;
    expect(global.window.location).to.eql('/');
    global.window.location = oldLocation;
  });

  it('should add the query `oauth=true` by default', () => {
    const defaultProps = generateProps({ query: {} });
    const wrapper = renderInReduxProvider(<SignInPage {...defaultProps} />, {
      initialState: defaultMockStore(),
    });

    expect(wrapper.getByText(/Sign in/)).to.not.be.null;
    expect(defaultProps.router.push.called).to.be.true;
    expect(defaultProps.router.push.args[0][0].includes('oauth=true'));
  });

  it('should check if the `oauth=false` query is present and not change it', () => {
    const defaultProps = generateProps({
      query: {
        oauth: 'false',
      },
    });
    const wrapper = renderInReduxProvider(<SignInPage {...defaultProps} />, {
      initialState: defaultMockStore(),
    });
    expect(wrapper.getByText(/Sign in/)).to.not.be.null;
    expect(defaultProps.router.push.called).to.be.false;
  });

  ['ebenefits', 'mhv', 'vaoccmobile'].forEach(app => {
    it(`should change 'oauth=true' to 'oauth=false' if the 'application=${app}' is not OAuth authorized`, () => {
      const defaultProps = generateProps({
        query: {
          oauth: true,
          application: app,
        },
      });
      const wrapper = renderInReduxProvider(<SignInPage {...defaultProps} />, {
        initialState: defaultMockStore(),
      });
      expect(wrapper.getByText(/Sign in/)).to.not.be.null;
      expect(
        defaultProps.router.push.args[0][0].includes(
          `?oauth=false&application=${app}`,
        ),
      );
    });
  });

  ['vamobile'].forEach(app => {
    it(`should keep 'oauth=false' if 'application=${app}' specified it`, () => {
      const defaultProps = generateProps({
        query: {
          oauth: false,
          application: app,
        },
      });
      const wrapper = renderInReduxProvider(<SignInPage {...defaultProps} />, {
        initialState: defaultMockStore(),
      });
      expect(wrapper.getByText(/Sign in/)).to.not.be.null;
      expect(
        defaultProps.router.push.args[0][0].includes(
          `?oauth=false&application=${app}`,
        ),
      );
    });

    it(`should default to 'oauth=true' if not specified for 'application=${app}'`, () => {
      const defaultProps = generateProps({
        query: {
          application: app,
        },
      });
      const wrapper = renderInReduxProvider(<SignInPage {...defaultProps} />, {
        initialState: defaultMockStore(),
      });
      expect(wrapper.getByText(/Sign in/)).to.not.be.null;
      expect(
        defaultProps.router.push.args[0][0].includes(
          `?oauth=true&application=${app}`,
        ),
      );
    });
  });

  it('should show a LogoutAlert when `auth=logged_out` query is present', () => {
    const defaultProps = generateProps({
      query: {
        auth: 'logged_out',
      },
    });
    const wrapper = renderInReduxProvider(<SignInPage {...defaultProps} />, {
      initialState: defaultMockStore(),
    });
    expect(wrapper.getByText(/You have successfully signed out./)).to.not.be
      .null;
    expect(wrapper.getByText(/Sign in/)).to.not.be.null;
  });

  it('should hide elements specified in the CSS', () => {
    const defaultProps = generateProps({ query: {} });
    renderInReduxProvider(<SignInPage {...defaultProps} />, {
      initialState: defaultMockStore(),
    });
    const style = document.querySelector('style');
    expect(style.innerHTML).to.contain(
      '.hidden-header {\n    visibility:hidden;\n  }\n',
    );
  });

  it('should render correctly in initial state without specific queries', () => {
    const defaultProps = generateProps({ query: {} });
    const wrapper = renderInReduxProvider(<SignInPage {...defaultProps} />, {
      initialState: defaultMockStore(),
    });

    expect(wrapper.getByText(/Sign in/)).to.not.be.null;
    expect(defaultProps.router.push.called).to.be.true;
  });
});
