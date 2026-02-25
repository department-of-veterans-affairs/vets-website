import { expect } from 'chai';
import sinon from 'sinon';

import * as Sentry from '@sentry/browser';
import * as recordEventModule from 'platform/monitoring/record-event';

import {
  CSP_IDS,
  SIGNUP_TYPES,
  POLICY_TYPES,
} from 'platform/user/authentication/constants';
import environments from 'site/constants/environments';
import AuthMetrics from '../containers/AuthMetrics';

const createPayload = (
  serviceName = 'idme',
  loaEnabled = false,
  authnContext = '/ial/2',
) => ({
  data: {
    attributes: {
      profile: {
        signIn: {
          serviceName,
        },
        authnContext,
        ...(loaEnabled && { loa: { current: 3 } }),
      },
    },
  },
});

const defaultPayload = createPayload();

describe('AuthMetrics', () => {
  let sandbox;
  let recordEventStub;
  const oldBuildType = __BUILDTYPE__;

  beforeEach(() => {
    __BUILDTYPE__ = environments.VAGOVPROD;
    sandbox = sinon.createSandbox();
    global.window = global.window || {};
    global.window.dataLayer = [];
    recordEventStub = sandbox.stub(recordEventModule, 'default');
  });

  afterEach(() => {
    recordEventStub.restore();
    sandbox.restore();
    __BUILDTYPE__ = oldBuildType;
  });

  it('should record event using compareLoginPolicy', () => {
    const authMetrics = new AuthMetrics(
      SIGNUP_TYPES[CSP_IDS.ID_ME],
      defaultPayload,
    );
    authMetrics.compareLoginPolicy();

    expect(recordEventStub.called).to.be.true;
    expect(recordEventStub.firstCall.args[0].event).to.equal(
      'login-mismatch-idme_signup-idme',
    );
  });

  it('should record `register-success` event using recordGAAuthEvents', () => {
    const authMetrics = new AuthMetrics(POLICY_TYPES.SIGNUP, defaultPayload);
    authMetrics.recordGAAuthEvents();

    expect(recordEventStub.called).to.be.true;
    expect(recordEventStub.firstCall.args[0].event).to.equal(
      'register-success-idme-ial2',
    );
  });

  it('should record `login-success` event using recordGAAuthEvents', () => {
    const authMetrics = new AuthMetrics(CSP_IDS.ID_ME, defaultPayload);
    authMetrics.recordGAAuthEvents();

    expect(recordEventStub.called).to.be.true;
    expect(recordEventStub.firstCall.args[0].event).to.equal(
      'login-success-idme-ial2',
    );
  });

  it('should record `login-or-register-success` event using recordGAAuthEvents', () => {
    const authMetrics = new AuthMetrics('unknownType', defaultPayload);
    authMetrics.recordGAAuthEvents();

    expect(recordEventStub.called).to.be.true;
    expect(recordEventStub.firstCall.args[0].event).to.equal(
      'login-or-register-success-idme-ial2',
    );
  });

  it('should call reportSentryErrors when userProfile is empty', () => {
    const spy = sinon.spy(Sentry, 'captureMessage');
    const authMetrics = new AuthMetrics(CSP_IDS.ID_ME, '');
    authMetrics.reportSentryErrors();

    expect(spy.called).to.be.true;
    expect(spy.firstCall.args[0]).to.equal(
      'Unexpected response for user object',
    );
    spy.restore();
  });

  it('should call reportSentryErrors when serviceName is empty', () => {
    const profile = {
      data: {
        attributes: {
          profile: {
            signIn: {
              serviceName: null,
            },
          },
        },
      },
    };
    const spy = sinon.spy(Sentry, 'captureMessage');
    const authMetrics = new AuthMetrics(CSP_IDS.ID_ME, profile);
    authMetrics.reportSentryErrors();

    expect(spy.called).to.be.true;
    expect(spy.firstCall.args[0]).to.equal(
      'Missing serviceName in user object',
    );
    spy.restore();
  });

  ['custom', 'mhv_verified'].forEach(type => {
    it(`should record the different recordGAAuthEvents for ${type}`, () => {
      const payload = createPayload(type);
      const authMetrics = new AuthMetrics(type, payload);
      authMetrics.recordGAAuthEvents();

      expect(recordEventStub.called).to.be.true;
      expect(recordEventStub.firstCall.args[0].event).to.equal(
        `login-success-${type}-ial2`,
      );
    });
  });

  it('should record the different recordGAAuthEvents for mhv', () => {
    const payload = createPayload('mhv');
    const authMetrics = new AuthMetrics('mhv', payload);
    authMetrics.recordGAAuthEvents();

    expect(recordEventStub.called).to.be.true;
    expect(recordEventStub.firstCall.args[0].event).to.equal(
      'login-success-mhv-ial2',
    );
    expect(recordEventStub.secondCall.args[0].event).to.equal(
      'login-mismatch-myhealthevet-mhv',
    );
  });

  it('should record the loa.current if exists', () => {
    const payload = createPayload('idme', true, '/loa/3');
    const authMetrics = new AuthMetrics('idme', payload);
    authMetrics.recordGAAuthEvents();

    expect(recordEventStub.called).to.be.true;
    expect(recordEventStub.firstCall.args[0].event).to.equal(
      'login-success-idme-loa3',
    );
    expect(recordEventStub.secondCall.args[0].event).to.equal(
      'login-loa-current-3',
    );
  });

  it('should run if no session active', () => {
    localStorage.clear();
    const payload = createPayload('idme', true, '/loa/3');
    const authMetrics = new AuthMetrics('idme', payload);
    const sessionSpy = sinon.spy(authMetrics, 'recordGAAuthEvents');
    authMetrics.run();
    expect(sessionSpy.called).to.be.true;
  });
});
