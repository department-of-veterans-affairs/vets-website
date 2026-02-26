import * as Sentry from '@sentry/browser';

import recordEvent from 'platform/monitoring/record-event';
import { CSP_IDS, POLICY_TYPES } from 'platform/user/authentication/constants';
import { SENTRY_TAGS } from 'platform/user/authentication/errors';
import get from 'platform/utilities/data/get';
import environment from 'platform/utilities/environment';
import environments from 'site/constants/environments';
import { parseAssuranceLevel } from '../helpers';

export default class AuthMetrics {
  constructor(type, payload, requestId, errorCode) {
    this.type = type;
    this.payload = payload;
    this.requestId = requestId;
    this.errorCode = errorCode;
    this.userAttributes = get('data.attributes', payload, {});
    this.userProfile = get('profile', this.userAttributes, {});
    this.loaCurrent = get('loa.current', this.userProfile, null);
    this.authnContext = get('authnContext', this.userProfile, undefined);
    this.serviceName = get('signIn.serviceName', this.userProfile, null);
    this.isProduction =
      environment.getRawBuildtype() === environments.VAGOVPROD &&
      !window.Cypress;
  }

  compareLoginPolicy = () => {
    // This is experimental code related to GA that will let us determine
    // if the backend is returning an accurate service_name

    const attemptedLoginPolicy =
      this.type === CSP_IDS.MHV ? CSP_IDS.MHV_VERBOSE : this.type;

    if (this.serviceName !== attemptedLoginPolicy && this.isProduction) {
      recordEvent({
        event: `login-mismatch-${attemptedLoginPolicy}-${this.serviceName}`,
      });
    }
  };

  recordGAAuthEvents = () => {
    switch (this.type) {
      case POLICY_TYPES.SIGNUP:
        if (this.isProduction) {
          recordEvent({
            event: `register-success-${this.serviceName}-${parseAssuranceLevel(
              this.authnContext,
            )}`,
          });
        }
        break;
      case POLICY_TYPES.CUSTOM: /* type=custom is used for SSOe auto login */
      case POLICY_TYPES.MHV_VERIFIED: /* type=mhv_verified */
      case CSP_IDS.MHV:
      case CSP_IDS.ID_ME:
      case CSP_IDS.LOGIN_GOV:
      case CSP_IDS.VAMOCK:
        if (this.isProduction) {
          recordEvent({
            event: `login-success-${this.serviceName}-${parseAssuranceLevel(
              this.authnContext,
            )}`,
          });
        }
        this.compareLoginPolicy();
        break;
      default:
        if (this.isProduction) {
          recordEvent({
            event: `login-or-register-success-${
              this.serviceName
            }-${parseAssuranceLevel(this.authnContext)}`,
          });
        }
        Sentry.withScope(scope => {
          scope.setExtra(SENTRY_TAGS.REQUEST_ID, this.requestId);
          scope.setExtra(SENTRY_TAGS.ERROR_CODE, this.errorCode);
          scope.setExtra(SENTRY_TAGS.LOGIN_TYPE, this.type || 'N/A');
          Sentry.captureMessage('Unrecognized auth event type');
        });
    }

    // Report out the current level of assurance for the user.
    if (this.loaCurrent && this.isProduction) {
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
    if (!JSON.parse(localStorage.getItem('hasSession')))
      this.recordGAAuthEvents();
  };
}
