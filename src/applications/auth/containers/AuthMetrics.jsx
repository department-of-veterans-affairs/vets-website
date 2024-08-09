import * as Sentry from '@sentry/browser';

import recordEvent from 'platform/monitoring/record-event';
import {
  dataDogLog,
  STATUS_TYPE,
  LOG_NAME,
  newPayload,
  DD_SESSION_STORAGE_KEY,
} from 'platform/user/authentication/datadog/utilities';
import { CSP_IDS, POLICY_TYPES } from 'platform/user/authentication/constants';
import { SENTRY_TAGS } from 'platform/user/authentication/errors';
import { hasSession } from 'platform/user/profile/utilities';
import get from 'platform/utilities/data/get';

export default class AuthMetrics {
  constructor(type, payload, requestId, errorCode) {
    this.type = type;
    this.payload = payload;
    this.requestId = requestId;
    this.errorCode = errorCode;
    this.userProfile = get('data.attributes.profile', payload, {});
    this.loaCurrent = get('loa.current', this.userProfile, null);
    this.serviceName = get('signIn.serviceName', this.userProfile, null);
    this.authBroker = get('signIn.authBroker', this.userProfile, null);
  }

  compareLoginPolicy = () => {
    // This is experimental code related to GA that will let us determine
    // if the backend is returning an accurate service_name

    const attemptedLoginPolicy =
      this.type === CSP_IDS.MHV ? CSP_IDS.MHV_VERBOSE : this.type;

    if (this.serviceName !== attemptedLoginPolicy) {
      recordEvent({
        event: `login-mismatch-${attemptedLoginPolicy}-${this.serviceName}`,
      });
    }
  };

  recordGAAuthEvents = () => {
    const ddSessionStorage = sessionStorage.getItem(DD_SESSION_STORAGE_KEY) || {
      authLocation: 'unknown',
      application: 'unknown',
    };
    const ddPayload = newPayload({
      csp: this.serviceName,
      authBroker: this.authBroker || 'unknown',
      authLocation: ddSessionStorage.authLocation,
      application: ddSessionStorage.application,
      level: this.loaCurrent || 'unknown',
    });

    switch (this.type) {
      case POLICY_TYPES.SIGNUP:
        dataDogLog({
          name: LOG_NAME.REGISTER_SUCCESS,
          payload: ddPayload,
          status: STATUS_TYPE.INFO,
        });
        recordEvent({ event: `register-success-${this.serviceName}` });
        break;
      case POLICY_TYPES.CUSTOM: /* type=custom is used for SSOe auto login */
      case POLICY_TYPES.MHV_VERIFIED: /* type=mhv_verified */
      case CSP_IDS.MHV:
      case CSP_IDS.DS_LOGON:
      case CSP_IDS.ID_ME:
      case CSP_IDS.LOGIN_GOV:
      case CSP_IDS.VAMOCK:
        dataDogLog({
          name: LOG_NAME.LOGIN_SUCCESS,
          payload: {
            ...ddPayload,
            ...(this.type === POLICY_TYPES.CUSTOM && { autoSSO: true }),
          },
          status: STATUS_TYPE.INFO,
        });
        recordEvent({ event: `login-success-${this.serviceName}` });
        this.compareLoginPolicy();
        break;
      default:
        recordEvent({
          event: `login-or-register-success-${this.serviceName}`,
        });
        Sentry.withScope(scope => {
          scope.setExtra(SENTRY_TAGS.REQUEST_ID, this.requestId);
          scope.setExtra(SENTRY_TAGS.ERROR_CODE, this.errorCode);
          scope.setExtra(SENTRY_TAGS.LOGIN_TYPE, this.type || 'N/A');
          Sentry.captureMessage('Unrecognized auth event type');
        });
    }

    // Report out the current level of assurance for the user.
    if (this.loaCurrent) {
      recordEvent({ event: `login-loa-current-${this.loaCurrent}` });
    }
  };

  reportSentryErrors = () => {
    if (!Object.keys(this.userProfile).length) {
      Sentry.captureMessage('Unexpected response for user object');
    } else if (!this.serviceName) {
      Sentry.captureMessage('Missing serviceName in user object');
    }
  };

  run = () => {
    this.reportSentryErrors();
    if (!hasSession()) this.recordGAAuthEvents();
  };
}
