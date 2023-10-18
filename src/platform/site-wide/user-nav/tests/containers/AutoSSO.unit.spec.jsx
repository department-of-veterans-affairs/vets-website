import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import * as ssoUtils from 'platform/utilities/sso';
import * as loginAttempted from 'platform/utilities/sso/loginAttempted';

import { AutoSSO } from '../../containers/AutoSSO';

const generateProps = ({
  authenticatedWithOAuth = false,
  hasCalledKeepAlive = false,
  transactionId = undefined,
  loggedIn = false,
  profileLoading = false,
}) => ({
  authenticatedWithOAuth,
  hasCalledKeepAlive,
  transactionId,
  loggedIn,
  profileLoading,
  checkKeepAlive: sinon.spy(),
});

const oldLocation = global.window.location;

describe('<AutoSSO>', () => {
  let props;

  beforeEach(() => {
    props = generateProps({});
    global.window.location = new URL(`http://dev.va.gov`);
  });

  afterEach(() => {
    global.window.location = oldLocation;
  });

  it('should not call removeLoginAttempted if user is logged out', () => {
    const stub = sinon.stub(loginAttempted, 'removeLoginAttempted');
    const wrapper = shallow(<AutoSSO {...props} />);
    stub.restore();
    sinon.assert.notCalled(stub);
    wrapper.unmount();
  });

  it('should call removeLoginAttempted if user is logged in', () => {
    const stub = sinon.stub(loginAttempted, 'removeLoginAttempted');
    props = generateProps({ loggedIn: true });
    const wrapper = shallow(<AutoSSO {...props} />);
    stub.restore();
    sinon.assert.calledOnce(stub);
    wrapper.unmount();
  });

  it(`should not call checkAutoSession on an invalid path ['/auth/login/callback']`, () => {
    global.window.location.pathname = `/auth/login/callback`;
    const stub = sinon.stub(ssoUtils, 'checkAutoSession').resolves(null);
    props = generateProps({ hasCalledKeepAlive: false });

    const wrapper = shallow(<AutoSSO {...props} />);
    stub.restore();
    sinon.assert.notCalled(stub);
    wrapper.unmount();
  });

  it('should not call checkAutoSession if `hasCalledKeepAlive` is true', () => {
    const stub = sinon.stub(ssoUtils, 'checkAutoSession').resolves(null);
    props = generateProps({ hasCalledKeepAlive: true });

    const wrapper = shallow(<AutoSSO {...props} />);
    stub.restore();
    sinon.assert.notCalled(stub);
    wrapper.unmount();
  });

  it('should call keepalive if all conditions are met', () => {
    const stub = sinon.stub(ssoUtils, 'checkAutoSession').resolves(null);
    props = generateProps({ authenticatedWithSSOe: true });
    const wrapper = shallow(<AutoSSO {...props} />);
    stub.restore();
    sinon.assert.calledOnce(stub);
    wrapper.unmount();
  });

  it('should NOT call keepalive if signed in with oAuth', () => {
    const stub = sinon.stub(ssoUtils, 'checkAutoSession').resolves(null);
    props = generateProps({ authenticatedWithOAuth: true });
    const wrapper = shallow(<AutoSSO {...props} />);
    stub.restore();
    sinon.assert.notCalled(props.checkKeepAlive);
    wrapper.unmount();
  });
});
