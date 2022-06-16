import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import localStorage from 'platform/utilities/storage/localStorage';

import { AuthApp } from '../containers/AuthApp';

const generateAuthApp = ({
  query = { auth: 'fail' },
  hasSession = false,
  oAuthOpts = {},
} = {}) => {
  const props = {
    location: {
      pathname: '/auth/login/callback',
      query,
      error: {
        message: 'Can not auth',
      },
    },
  };
  if (hasSession) {
    localStorage.setItem('hasSession', true);
  }
  if (Object.keys(oAuthOpts).length) {
    Object.keys(oAuthOpts).forEach(key => {
      sessionStorage.setItem(key, oAuthOpts[key]);
    });
  }
  const wrapper = shallow(<AuthApp {...props} />);
  const instance = wrapper.instance();

  return { props, wrapper, instance };
};

describe('AuthApp', () => {
  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('should check the div', () => {
    const { wrapper } = generateAuthApp();
    expect(wrapper.exists('div.vads-u-padding-y--5')).to.be.true;
    wrapper.unmount();
  });

  it('should fire validateSession if `hasSession` is true', () => {
    const { wrapper, instance } = generateAuthApp({ hasSession: true });
    const spy = sinon.spy(instance, 'validateSession');
    instance.componentDidMount();

    expect(spy.called).to.be.true;
    wrapper.unmount();
  });

  it('should fire validateSession if `hasError` is false', () => {
    const { wrapper, instance } = generateAuthApp({
      query: { auth: 'not-fail' },
    });
    const spy = sinon.spy(instance, 'validateSession');
    instance.componentDidMount();

    expect(spy.called).to.be.true;
    wrapper.unmount();
  });

  it('should not fire validateSession if `hasError` is true or `hasSession` is false', () => {
    const { wrapper, instance } = generateAuthApp({});
    const spy = sinon.spy(instance, 'validateSession');
    instance.componentDidMount();

    expect(spy.called).to.be.false;
    wrapper.unmount();
  });

  it('should fire handleAuthForceNeeded', () => {
    const { wrapper, instance } = generateAuthApp({
      query: { auth: 'force-needed' },
      hasSession: true,
    });
    const spy = sinon.spy(instance, 'handleAuthForceNeeded');
    instance.componentDidMount();

    expect(spy.called).to.be.true;
    wrapper.unmount();
  });

  it('should fire handleAuthSuccess', () => {
    const { wrapper, instance } = generateAuthApp({
      query: { type: 'idme' },
      hasSession: true,
    });
    const spy = sinon.spy(instance, 'handleAuthSuccess');
    instance.handleAuthSuccess();

    expect(spy.called).to.be.true;
    wrapper.unmount();
  });

  it('should fire handleAuthError', () => {
    const error = {
      error: {
        message: 'Can not auth',
      },
    };
    const { wrapper, instance } = generateAuthApp({
      query: { type: 'idme', code: '101' },
      hasSession: true,
    });
    const spy = sinon.spy(instance, 'handleAuthError');
    instance.handleAuthError(error);

    expect(spy.called).to.be.true;
    expect(wrapper.state()).to.include({
      code: '101',
      hasError: true,
      loginType: 'idme',
    });
    wrapper.unmount();
  });

  it('should fire handleTokenRequest', async () => {
    const code = '9f9f13';
    const state = 'state_success';
    const { wrapper, instance } = generateAuthApp({
      query: { auth: 'success', state, code },
      hasSession: true,
      oAuthOpts: { codeVerifier: 'cv_success', state },
    });

    const spy = sinon.spy(instance, 'handleTokenRequest');
    await instance.handleTokenRequest({ code, state });

    expect(spy.called).to.be.true;
    wrapper.unmount();
  });
  it('should fire generateOAuthError when state mismatch', async () => {
    const code = '9f9f13';
    const state = 'mismatch';
    const { wrapper, instance } = generateAuthApp({
      query: { auth: 'success', code, state },
      hasSession: true,
      oAuthOpts: { codeVerifier: 'cv_success', state: 'other_state' },
    });

    const spy = sinon.spy(instance, 'generateOAuthError');
    await instance.handleTokenRequest({ code });

    expect(spy.called).to.be.true;
    expect(wrapper.state()).to.include({
      code: '202',
      auth: 'fail',
      hasError: true,
    });
    wrapper.unmount();
  });
});
