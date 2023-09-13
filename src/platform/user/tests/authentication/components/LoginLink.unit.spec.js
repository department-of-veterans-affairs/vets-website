import React from 'react';
import { SERVICE_PROVIDERS } from 'platform/user/authentication/constants';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { render } from '@testing-library/react';
import sinon from 'sinon';
import * as authUtilities from 'platform/user/authentication/utilities';
import LoginLink, {
  loginHandler,
} from 'platform/user/authentication/components/LoginLink';

const csps = Object.values(SERVICE_PROVIDERS);

describe('LoginLink', () => {
  it('should not render with a `csp`', () => {
    const screen = render(<LoginLink />);
    expect(screen.queryByRole('link')).to.be.null;
  });

  csps.forEach(csp => {
    it(`should render correctly for ${csp.policy}`, () => {
      const screen = render(<LoginLink csp={csp.policy} />);

      expect(screen.getByTestId('login-link')).to.have.attr(
        'data-csp',
        csp.policy,
      );
      expect(screen.getByTestId('login-link')).to.have.attr(
        'aria-label',
        `Sign in with ${SERVICE_PROVIDERS[csp.policy].label}`,
      );
    });
  });
  it('should call the `loginHandler` function on click', () => {
    const loginHandlerSpy = sinon.spy();
    const wrapper = shallow(
      <LoginLink csp="dslogon" onClick={loginHandlerSpy} />,
    );

    wrapper.find('.vads-c-action-link--blue').simulate('click');
    expect(loginHandlerSpy.called).to.be.true;
    wrapper.unmount();
  });
});

describe('loginHandler', () => {
  it('logs a user in with the correct `csp`', () => {
    const mockAuthLogin = sinon.stub(authUtilities, 'login');
    const loginHandlerSpy = sinon.spy(loginHandler);

    loginHandlerSpy('mhv');
    expect(loginHandlerSpy.called).to.be.true;
    expect(mockAuthLogin.called).to.be.true;
    expect(mockAuthLogin.calledWith({ policy: 'mhv' })).to.be.true;

    mockAuthLogin.restore();
  });
});
