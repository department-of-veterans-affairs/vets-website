import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import localStorage from 'platform/utilities/storage/localStorage';
import * as ssoUtils from 'platform/utilities/sso';
import * as loginAttempted from 'platform/utilities/sso/loginAttempted';

import { AutoSSO } from '../../containers/AutoSSO';

describe('<AutoSSO>', () => {
  let props = {};

  beforeEach(() => {
    props = {
      useInboundSSOe: false,
      hasCalledKeepAlive: false,
      authenticatedWithSSOe: false,
      profileLoading: false,
      checkKeepAlive: sinon.spy(),
    };
  });

  afterEach(() => {
    localStorage.clear();
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
    localStorage.setItem('hasSession', 'true');
    const wrapper = shallow(<AutoSSO {...props} />);
    stub.restore();
    sinon.assert.calledOnce(stub);
    wrapper.unmount();
  });

  it('should not call checkAutoSession if it already has', () => {
    const stub = sinon.stub(ssoUtils, 'checkAutoSession').resolves(null);
    Object.assign(props, {
      hasCalledKeepAlive: true,
      useInboundSSOe: true,
    });
    const wrapper = shallow(<AutoSSO {...props} />);
    stub.restore();
    sinon.assert.notCalled(stub);
    wrapper.unmount();
  });

  it('should call keepalive if it has yet to', () => {
    const stub = sinon.stub(ssoUtils, 'checkAutoSession').resolves(null);
    Object.assign(props, {
      hasCalledKeepAlive: false,
      useInboundSSOe: true,
    });
    const wrapper = shallow(<AutoSSO {...props} />);
    stub.restore();
    sinon.assert.calledOnce(stub);
    wrapper.unmount();
  });
});
