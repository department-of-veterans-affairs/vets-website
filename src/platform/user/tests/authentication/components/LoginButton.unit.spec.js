import React from 'react';
import { SERVICE_PROVIDERS } from 'platform/user/authentication/constants';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { render } from '@testing-library/react';
import sinon from 'sinon';
import * as authUtilities from 'platform/user/authentication/utilities';
import * as monitoring from 'platform/monitoring/record-event';
import LoginButton, {
  loginHandler,
} from 'platform/user/authentication/components/LoginButton';

const csps = Object.values(SERVICE_PROVIDERS);
describe('loginHandler', () => {
  let sandbox;
  let recordEventStub;
  let loginStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    recordEventStub = sandbox.stub(monitoring, 'default'); // Stub recordEvent
    loginStub = sandbox.stub(authUtilities, 'login').resolves(); // Stub login
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('logs a user in with the correct `csp`', () => {
    const csp = 'mhv';

    loginHandler(csp);

    // Verify recordEvent is called with expected data
    expect(recordEventStub.calledOnce).to.be.true;
    expect(recordEventStub.firstCall.args[0]).to.deep.equal({
      event: `login-attempted-${csp}`,
    });

    // Verify login is called with the correct parameters
    expect(loginStub.calledOnce).to.be.true;
    expect(loginStub.firstCall.args[0]).to.deep.equal({
      policy: csp,
      queryParams: { oauth: false }, // Match the actual default behavior
    });
  });

  it('logs a user in with OAuth and additional query parameters', () => {
    const csp = 'idme';
    const additionalQueryParams = { redirectUrl: '/dashboard' };

    loginHandler(csp, true, additionalQueryParams);

    // Verify recordEvent is called with expected data
    expect(recordEventStub.calledOnce).to.be.true;
    expect(recordEventStub.firstCall.args[0]).to.deep.equal({
      event: `login-attempted-${csp}-oauth`,
    });

    // Verify login is called with correct parameters
    expect(loginStub.calledOnce).to.be.true;
    expect(loginStub.firstCall.args[0]).to.deep.equal({
      policy: csp,
      queryParams: { oauth: true, redirectUrl: '/dashboard' },
    });
  });
});

describe('LoginButton', () => {
  it('should not render without a `csp`', () => {
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
      <LoginButton csp="dslogon" onClick={loginHandlerSpy} />,
    );

    wrapper.find('button').simulate('click');
    expect(loginHandlerSpy.called).to.be.true;
    wrapper.unmount();
  });
});
