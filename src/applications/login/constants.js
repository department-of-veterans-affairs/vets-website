import { signup } from 'platform/user/authentication/utilities';
import { CSP_IDS } from 'platform/user/authentication/constants';
import recordEvent from 'platform/monitoring/record-event';
import environment from 'platform/utilities/environment';

export const TRANSITION_ENDPOINT = `${
  environment.API_URL
}/inherited_proofing/auth`;

export const EVENTS = {
  TRANSITION_STARTED: 'login-transition-started-mhv-to-logingov',
  TRANSITION_PAGE_DISMISSED: 'login-transition-page-dismissed',
};

export const IDENTITY_WIZARD_QUESTIONS = [
  {
    question: `1. Do you already use one of these sign-on options to access services on VA.gov?`,
    options: [
      {
        label: 'Login.gov',
        name: 'signinoptions',
        value: 'logingov',
      },
      {
        label: 'ID.me',
        name: 'signinoptions',
        value: 'idme',
      },
      {
        label: "No. I don't have either of these",
        name: 'signinoptions',
        value: 'none',
      },
    ],
  },
  {
    question: '2. Which forms of identification do you have?',
    options: [
      {
        label: 'State-issued Identification (drivers license)',
        name: 'idoptions',
        value: 'state',
      },
      {
        label: 'Other (US or Foreign passport)',
        name: 'idoptions',
        value: 'other',
      },
      {
        label: 'None of these',
        name: 'idoptions',
        value: 'none',
      },
    ],
  },
];

export const CSP_REASONS = {
  state: ['You have a state-issued form of identification'],
  other: ['You have a passport as a form of identification'],
  none: [
    `You don't have a form of identification`,
    `You can answer questions about your identity`,
  ],
};

export const ACCOUNT_TRANSITION = {
  headline: {
    enabled: `In order to transition your account we will securely share the following personal information with Login.gov`,
    disabled: `Here are the following items you need to create an account with one our trusted partners: Login.gov or ID.me`,
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
