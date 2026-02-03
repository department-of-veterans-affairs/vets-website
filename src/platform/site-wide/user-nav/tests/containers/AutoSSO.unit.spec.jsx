import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { server } from 'platform/testing/unit/mocha-setup';

import * as ssoUtils from 'platform/utilities/sso';
import * as loginAttempted from 'platform/utilities/sso/loginAttempted';
import { headKeepAliveSuccess } from '../mocks/msw-mocks';

import { AutoSSO } from '../../containers/AutoSSO';

const generateProps = ({
  authenticatedWithOAuth = false,
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
  beforeEach(() => {
    server.use(headKeepAliveSuccess);
  });

  it('should not call removeLoginAttempted if user is logged out', () => {
    const stub = sinon.stub(loginAttempted, 'removeLoginAttempted');
    const props = generateProps();
    const wrapper = shallow(<AutoSSO {...props} />);
    stub.restore();
    sinon.assert.notCalled(stub);
    wrapper.unmount();
  });

  it('should call removeLoginAttempted if user is logged in', () => {
    const stub = sinon.stub(loginAttempted, 'removeLoginAttempted');
    const props = generateProps({ loggedIn: true });
    const wrapper = shallow(<AutoSSO {...props} />);
    stub.restore();
    sinon.assert.calledOnce(stub);
    wrapper.unmount();
  });

  it(`should not call checkAutoSession on an invalid path ['/auth/login/callback']`, () => {
    const oldLocation = global.window.location;
    global.window.location = new URL('https://dev.va.gov');
    global.window.location.pathname = `/auth/login/callback`;
    const stub = sinon.stub(ssoUtils, 'checkAutoSession').resolves(null);
    const props = generateProps({ hasCalledKeepAlive: false });
    const wrapper = shallow(<AutoSSO {...props} />);
    stub.restore();
    sinon.assert.notCalled(stub);
    wrapper.unmount();
    global.window.location = oldLocation;
  });

  it('should not call checkAutoSession if `hasCalledKeepAlive` is true', () => {
    const stub = sinon.stub(ssoUtils, 'checkAutoSession').resolves(null);
    const props = generateProps({ hasCalledKeepAlive: true });

    const wrapper = shallow(<AutoSSO {...props} />);
    stub.restore();
    sinon.assert.notCalled(stub);
    wrapper.unmount();
  });

  it('should call keepalive if all conditions are met', () => {
    const stub = sinon.stub(ssoUtils, 'checkAutoSession').resolves(null);
    const props = generateProps({ authenticatedWithSSOe: true });
    const wrapper = shallow(<AutoSSO {...props} />);
    stub.restore();
    sinon.assert.calledOnce(stub);
    wrapper.unmount();
  });

  it('should NOT call keepalive if signed in with oAuth', () => {
    const stub = sinon.stub(ssoUtils, 'checkAutoSession').resolves(null);
    const props = generateProps({ authenticatedWithOAuth: true });
    const wrapper = shallow(<AutoSSO {...props} />);
    stub.restore();
    sinon.assert.notCalled(props.checkKeepAlive);
    wrapper.unmount();
  });
});
