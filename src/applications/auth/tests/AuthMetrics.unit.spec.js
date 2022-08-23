import { expect } from 'chai';
import sinon from 'sinon';

import * as Sentry from '@sentry/browser';

import {
  CSP_IDS,
  SIGNUP_TYPES,
  POLICY_TYPES,
} from 'platform/user/authentication/constants';
import AuthMetrics from '../containers/AuthMetrics';

const payload = {
  data: {
    attributes: {
      profile: {
        signIn: {
          serviceName: 'idme',
        },
      },
    },
  },
};

describe('AuthMetrics', () => {
  it('should record event using compareLoginPolicy', () => {
    const authMetrics = new AuthMetrics(SIGNUP_TYPES[CSP_IDS.ID_ME], payload);
    authMetrics.compareLoginPolicy();
    const gwData = global.window.dataLayer;
    const recordedEvent = gwData[gwData.length - 1];

    expect(recordedEvent.event).to.equal('login-mismatch-idme_signup-idme');
  });

  it('should record `register-success` event using recordGAAuthEvents', () => {
    const authMetrics = new AuthMetrics(POLICY_TYPES.SIGNUP, payload);
    authMetrics.recordGAAuthEvents();
    const gwData = global.window.dataLayer;
    const recordedEvent = gwData[gwData.length - 1];

    expect(recordedEvent.event).to.equal('register-success-idme');
  });

  it('should record `login-success` event using recordGAAuthEvents', () => {
    const authMetrics = new AuthMetrics(CSP_IDS.ID_ME, payload);
    authMetrics.recordGAAuthEvents();
    const gwData = global.window.dataLayer;
    const recordedEvent = gwData[gwData.length - 1];

    expect(recordedEvent.event).to.equal('login-success-idme');
  });

  it('should record `login-or-register-success` event using recordGAAuthEvents', () => {
    const authMetrics = new AuthMetrics('unknownType', payload);
    authMetrics.recordGAAuthEvents();
    const gwData = global.window.dataLayer;
    const recordedEvent = gwData[gwData.length - 1];

    expect(recordedEvent.event).to.equal('login-or-register-success-idme');
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
});
