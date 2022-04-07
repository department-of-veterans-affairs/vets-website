import { signup } from 'platform/user/authentication/utilities';
import {
  CSP_IDS,
  MHV_TRANSITION_TIME,
} from 'platform/user/authentication/constants';
import recordEvent from 'platform/monitoring/record-event';
import environment from 'platform/utilities/environment';

export const TRANSITION_ENDPOINT = `${
  environment.API_URL
}/inherited_proofing/auth`;

export const EVENTS = {
  TRANSITION_STARTED: 'login-transition-started-mhv-to-logingov',
  TRANSITION_PAGE_DISMISSED: 'login-transition-page-dismissed',
};

export const ACCOUNT_TRANSITION = {
  headline: {
    eligible: 'Transfer your account to Login.gov now',
    ineligible: 'Create your new account',
  },
  subheader: {
    eligible: `This process should take about ${MHV_TRANSITION_TIME} minutes.`,
    ineligible:
      'You can create either a verified Login.gov or ID.me account.  Both accounts are free.  Login.gov is an account created, maintained, and secured by the U.S. government.',
  },
  signUpLoginGov() {
    signup({ csp: CSP_IDS.LOGIN_GOV });
  },
  signUpIDme() {
    signup({ csp: CSP_IDS.ID_ME });
  },
  startTransition() {
    const redirect = () => {
      window.location = TRANSITION_ENDPOINT;
    };
    recordEvent({
      event: EVENTS.TRANSITION_STARTED,
      eventCallback: redirect,
      eventTimeout: 2000,
    });
  },
  dismiss() {
    const redirect = () => {
      // TODO: Implement logic to return users to previous page
      window.location = '/';
    };
    recordEvent({
      event: EVENTS.TRANSITION_PAGE_DISMISSED,
      eventCallback: redirect,
      eventTimeout: 2000,
    });
  },
};
