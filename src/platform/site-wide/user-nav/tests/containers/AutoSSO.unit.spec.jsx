import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import localStorage from 'platform/utilities/storage/localStorage';
import * as authUtils from 'platform/user/authentication/utilities';
import { AutoSSO } from '../../containers/AutoSSO';

describe('<AutoSSO>', () => {
  const props = {
    useSSOe: false,
    useInboundSSOe: false,
  };

  beforeEach(() => localStorage.setItem('hasSessionSSO', true));
  afterEach(() => localStorage.clear());

  describe('checkStatus', () => {
    it('should not keep keepalive if it already has', () => {
      const wrapper = shallow(<AutoSSO {...props} />);
      wrapper.instance().checkStatus = sinon.spy();
      wrapper.setState({ hasCalledKeepAlive: true });
      wrapper.setProps({
        useSSOe: true,
        useInboundSSOe: true,
      });
      expect(wrapper.instance().checkStatus.called).to.be.false;
      wrapper.unmount();
    });

    it('should automatically initiate a session log in if a SSOe-flagged user has an active SSOe session but no vets-website session', done => {
      authUtils.autoLogin = sinon.spy();
      const wrapper = shallow(<AutoSSO {...props} />);
      wrapper.setProps({
        useSSOe: true,
        useInboundSSOe: true,
      });
      done();
      expect(authUtils.autoLogin.called).to.be.true;
      wrapper.unmount();
    });

    it('should automatically log out if a SSOe-flagged user has an active vets-website session but no SSOe session', done => {
      authUtils.autoLogout = sinon.spy();
      const wrapper = shallow(<AutoSSO {...props} />);
      wrapper.setProps({
        useSSOe: true,
        useInboundSSOe: true,
      });
      done();
      expect(authUtils.autoLogout.called).to.be.true;
      wrapper.unmount();
    });
  });
});
