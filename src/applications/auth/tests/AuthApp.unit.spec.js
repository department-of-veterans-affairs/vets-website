import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import localStorage from 'platform/utilities/storage/localStorage';

import AuthApp from '../containers/AuthApp';

const oldWindow = global.window;
const generateAuthApp = ({
  query = { auth: 'fail' },
  hasSession = false,
  oAuthOpts = {},
  returnUrl = '',
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

  if (returnUrl.length) {
    sessionStorage.setItem('authReturnUrl', returnUrl);
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
    const { wrapper, instance } = generateAuthApp({
      hasSession: true,
      query: { auth: 'not-fail' },
    });
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
    const { wrapper, instance } = generateAuthApp({
      query: { auth: 'fail', hasSession: false },
    });
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
      errorCode: '101',
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
      errorCode: '202',
      auth: 'fail',
      hasError: true,
    });
    wrapper.unmount();
  });

  it('should fire redirect & send user to non-homepage route', () => {
    global.window = { location: { replace: sinon.spy() } };
    const returnUrl = 'http://localhost/education/eligibility';
    const { wrapper, instance } = generateAuthApp({
      query: { type: 'idme' },
      hasSession: true,
      returnUrl,
    });
    const redirectSpy = sinon.spy(instance, 'redirect');
    const checkReturnUrlSpy = sinon.spy(instance, 'checkReturnUrl');
    instance.redirect();
    instance.checkReturnUrl(returnUrl);

    expect(redirectSpy.called).to.be.true;
    expect(checkReturnUrlSpy.calledWith(returnUrl)).to.be.true;
    expect(global.window.location.replace.calledWith(returnUrl));
    global.window = oldWindow;
    wrapper.unmount();
  });

  it('should fire redirect & send user to /my-va/ route', () => {
    global.window = { location: { replace: sinon.spy() } };
    const { wrapper, instance } = generateAuthApp({
      query: { type: 'idme' },
      hasSession: true,
      returnUrl: 'http://localhost/',
    });
    const spy = sinon.spy(instance, 'redirect');
    instance.redirect();

    expect(spy.called).to.be.true;
    expect(global.window.location.replace.calledWith('http://localhost/my-va/'))
      .to.be.true;
    global.window = oldWindow;
    wrapper.unmount();
  });

  it('should call send a non-verified Cerner user to `/verify`', () => {
    global.window = { location: { replace: sinon.spy() } };
    const returnUrl = `https://staging-patientportal.myhealth.va.gov`;
    const { wrapper, instance } = generateAuthApp({
      query: { type: 'idme' },
      hasSession: true,
      returnUrl,
    });

    const cernerSpy = sinon.spy(instance, 'redirect');
    instance.redirect();

    expect(cernerSpy.called).to.be.true;
    expect(global.window.location.replace.calledWith('/verify')).to.be.false;
    global.window = oldWindow;
    wrapper.unmount();
  });
});
