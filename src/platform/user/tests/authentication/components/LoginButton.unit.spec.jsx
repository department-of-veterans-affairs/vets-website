import React from 'react';
import { Provider } from 'react-redux';
import { ACTIVE_SERVICE_PROVIDERS } from 'platform/user/authentication/constants';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import sinon from 'sinon';
import * as authUtilities from 'platform/user/authentication/utilities';
import * as oauthUtils from 'platform/utilities/oauth/utilities';
import LoginButton, {
  loginHandler,
} from 'platform/user/authentication/components/LoginButton';
import { TOGGLE_NAMES } from 'platform/utilities/feature-toggles';

const csps = Object.values(ACTIVE_SERVICE_PROVIDERS);
const store = {
  getState: () => ({
    featureToggles: {
      [TOGGLE_NAMES.identityLogingovIal2Enforcement]: false,
      [TOGGLE_NAMES.identityIdmeIal2Enforcement]: false,
      [TOGGLE_NAMES.identityIal2FullEnforcement]: false,
    },
  }),
  dispatch: () => {},
  subscribe: () => {},
};

describe('LoginButton', () => {
  it('should not render with a `csp`', () => {
    const screen = render(
      <Provider store={store}>
        <LoginButton />
      </Provider>,
    );
    expect(screen.queryByRole('button')).to.be.null;
  });
  csps.forEach(csp => {
    it(`should render correctly for ${csp.policy}`, () => {
      const screen = render(
        <Provider store={store}>
          <LoginButton csp={csp.policy} />
        </Provider>,
      );

      expect(screen.queryByRole('button')).to.have.attr('data-csp', csp.policy);
    });
  });
  it('should call the `loginHandler` function on click', () => {
    const loginHandlerSpy = sinon.spy();
    const screen = render(
      <Provider store={store}>
        <LoginButton csp="idme" onClick={loginHandlerSpy} />
      </Provider>,
    );

    screen.getByRole('button').click();
    expect(loginHandlerSpy.called).to.be.true;
    screen.unmount();
  });
});

describe('loginHandler', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('logs a user in with the correct `csp`', () => {
    const mockAuthLogin = sandbox.stub(authUtilities, 'login');
    const loginHandlerSpy = sandbox.spy(loginHandler);

    loginHandlerSpy('logingov');
    expect(loginHandlerSpy.called).to.be.true;
    expect(mockAuthLogin.called).to.be.true;
    expect(
      mockAuthLogin.calledWith({ policy: 'logingov', ial2Enforcement: false }),
    ).to.be.true;

    mockAuthLogin.restore();
  });

  it('returns a url for okta', () => {
    const mockAuthLogin = sandbox.stub(oauthUtils, 'createOktaOAuthRequest');
    const loginHandlerSpy = sandbox.spy(loginHandler);

    loginHandlerSpy('logingov', true, {
      clientId: 'okta_test',
      codeChallenge: 'codetest',
      state: 'some_state',
    });

    expect(loginHandlerSpy.called).to.be.true;
    expect(mockAuthLogin.called).to.be.true;
    expect(
      mockAuthLogin.calledWith({
        clientId: 'okta_test',
        codeChallenge: 'codetest',
        loginType: 'logingov',
        state: 'some_state',
      }),
    ).to.be.true;

    mockAuthLogin.restore();
  });
});
