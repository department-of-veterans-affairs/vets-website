import React from 'react';
import { render } from '@testing-library/react';
import sinon from 'sinon';
import { server } from 'platform/testing/unit/mocha-setup';

import * as ssoUtils from 'platform/utilities/sso';
import * as loginAttempted from 'platform/utilities/sso/loginAttempted';
import { headKeepAliveSuccess } from '../mocks/msw-mocks';

import { AutoSSO } from '../../containers/AutoSSO';

const generateProps = ({
  authenticatedWithOAuth = true,
  hasCalledKeepAlive = false,
  transactionId = undefined,
  loggedIn = false,
  profileLoading = false,
} = {}) => ({
  authenticatedWithOAuth,
  hasCalledKeepAlive,
  transactionId,
  loggedIn,
  profileLoading,
  checkKeepAlive: sinon.spy(),
});

describe('<AutoSSO>', () => {
  const sandbox = sinon.createSandbox();

  beforeEach(() => {
    server.use(headKeepAliveSuccess);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should not call removeLoginAttempted if user is logged out', () => {
    sandbox.stub(loginAttempted, 'removeLoginAttempted');
    const props = generateProps();
    render(<AutoSSO {...props} />);
    sinon.assert.notCalled(loginAttempted.removeLoginAttempted);
  });

  it('should call removeLoginAttempted if user is logged in', () => {
    sandbox.stub(loginAttempted, 'removeLoginAttempted');
    const props = generateProps({ loggedIn: true });
    render(<AutoSSO {...props} />);
    sinon.assert.calledOnce(loginAttempted.removeLoginAttempted);
  });

  it(`should not call checkAutoSession on an invalid path ['/auth/login/callback']`, () => {
    const oldLocation = global.window.location;
    global.window.location = new URL('https://dev.va.gov');
    global.window.location.pathname = `/auth/login/callback`;
    sandbox.stub(ssoUtils, 'checkAutoSession').resolves(null);
    const props = generateProps({ hasCalledKeepAlive: false });
    render(<AutoSSO {...props} />);
    sinon.assert.notCalled(ssoUtils.checkAutoSession);
    global.window.location = oldLocation;
  });

  it('should not call checkAutoSession if `hasCalledKeepAlive` is true', () => {
    sandbox.stub(ssoUtils, 'checkAutoSession').resolves(null);
    const props = generateProps({ hasCalledKeepAlive: true });
    render(<AutoSSO {...props} />);
    sinon.assert.notCalled(ssoUtils.checkAutoSession);
  });

  it('should call keepalive if all conditions are met', () => {
    sandbox.stub(ssoUtils, 'checkAutoSession').resolves(null);
    const props = generateProps({ authenticatedWithOAuth: false });
    render(<AutoSSO {...props} />);
    sinon.assert.calledOnce(ssoUtils.checkAutoSession);
  });

  it('should NOT call keepalive if signed in with oAuth', () => {
    sandbox.stub(ssoUtils, 'checkAutoSession').resolves(null);
    const props = generateProps({ authenticatedWithOAuth: true });
    render(<AutoSSO {...props} />);
    sinon.assert.notCalled(props.checkKeepAlive);
  });
});
