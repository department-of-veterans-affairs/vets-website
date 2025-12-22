import React from 'react';
import { ACTIVE_SERVICE_PROVIDERS } from 'platform/user/authentication/constants';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { render } from '@testing-library/react';
import sinon from 'sinon';
import * as authUtilities from 'platform/user/authentication/utilities';
import * as oauthUtils from 'platform/utilities/oauth/utilities';
import LoginButton, {
  loginHandler,
} from 'platform/user/authentication/components/LoginButton';

const csps = Object.values(ACTIVE_SERVICE_PROVIDERS);

describe('LoginButton', () => {
  it('should not render with a `csp`', () => {
    const screen = render(<LoginButton />);
    expect(screen.queryByRole('button')).to.be.null;
  });
  csps.forEach(csp => {
    it(`should render correctly for ${csp.policy}`, () => {
      const screen = render(<LoginButton csp={csp.policy} />);

      expect(screen.queryByRole('button')).to.have.attr('data-csp', csp.policy);
    });
  });
  it('should call the `loginHandler` function on click', () => {
    const loginHandlerSpy = sinon.spy();
    const wrapper = shallow(
      <LoginButton csp="idme" onClick={loginHandlerSpy} />,
    );

    wrapper.find('button').simulate('click');
    expect(loginHandlerSpy.called).to.be.true;
    wrapper.unmount();
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
    expect(mockAuthLogin.calledWith({ policy: 'logingov' })).to.be.true;

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
