import React from 'react';
import { CSP_IDS, CSP_CONTENT } from 'platform/user/authentication/constants';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { render } from '@testing-library/react';
import sinon from 'sinon';
import * as authUtilities from 'platform/user/authentication/utilities';
import LoginButton, {
  loginHandler,
} from 'platform/user/authentication/components/LoginButton';

const csps = Object.values(CSP_IDS).filter(csp => csp !== 'myhealthevet');

describe('LoginButton', () => {
  it('should not render with a `csp`', () => {
    const screen = render(<LoginButton />);
    expect(screen.queryByRole('button')).to.be.null;
  });
  csps.forEach(csp => {
    it(`should render correctly for ${csp}`, () => {
      const screen = render(<LoginButton csp={csp} />);

      expect(screen.queryByRole('button')).to.have.attr('data-csp', csp);
      expect(screen.queryByRole('button')).to.have.attr(
        'aria-label',
        `Sign in with ${CSP_CONTENT[csp].COPY}`,
      );
    });
  });
  it('should call the `loginHandler` function on click', () => {
    const loginHandlerSpy = sinon.spy();
    const wrapper = shallow(
      <LoginButton csp="dslogon" onClick={loginHandlerSpy} />,
    );

    wrapper.find('button').simulate('click');
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
