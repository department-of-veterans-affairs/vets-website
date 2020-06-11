import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import * as ssoUtils from 'platform/utilities/sso';
import * as forceAuth from 'platform/utilities/sso/forceAuth';

import { AutoSSO } from '../../containers/AutoSSO';

describe('<AutoSSO>', () => {
  let props = {};

  beforeEach(() => {
    props = {
      useSSOe: false,
      useInboundSSOe: false,
      hasCalledKeepAlive: false,
      userLoggedIn: false,
      checkKeepAlive: sinon.spy(),
    };
  });

  it('should not call removeForceAuth if user is logged out', () => {
    const stub = sinon.stub(forceAuth, 'removeForceAuth');
    const wrapper = shallow(<AutoSSO {...props} />);
    stub.restore();
    sinon.assert.notCalled(stub);
    wrapper.unmount();
  });

  it('should call removeForceAuth if user is logged in', () => {
    const stub = sinon.stub(forceAuth, 'removeForceAuth');
    Object.assign(props, {
      userLoggedIn: true,
    });
    const wrapper = shallow(<AutoSSO {...props} />);
    stub.restore();
    sinon.assert.calledOnce(stub);
    wrapper.unmount();
  });

  it('should call setForceAuth if inbound ssoe is disabled', () => {
    const stub = sinon.stub(forceAuth, 'setForceAuth');
    Object.assign(props, {
      userInboundSSOe: false,
    });
    const wrapper = shallow(<AutoSSO {...props} />);
    stub.restore();
    sinon.assert.calledOnce(stub);
    wrapper.unmount();
  });

  it('should not call setForceAuth if inbound ssoe is enabled', () => {
    const stub = sinon.stub(forceAuth, 'setForceAuth');
    Object.assign(props, {
      useInboundSSOe: true,
    });
    const wrapper = shallow(<AutoSSO {...props} />);
    stub.restore();
    sinon.assert.notCalled(stub);
    wrapper.unmount();
  });

  it('should not call checkAutoSession if it already has', () => {
    const stub = sinon.stub(ssoUtils, 'checkAutoSession').resolves(null);
    Object.assign(props, {
      hasCalledKeepAlive: true,
      useSSOe: true,
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
      useSSOe: true,
      useInboundSSOe: true,
    });
    const wrapper = shallow(<AutoSSO {...props} />);
    stub.restore();
    sinon.assert.calledOnce(stub);
    wrapper.unmount();
  });
});
