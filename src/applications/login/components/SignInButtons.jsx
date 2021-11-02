import React from 'react';

import environment from 'platform/utilities/environment';
import recordEvent from 'platform/monitoring/record-event';
import { login, signup } from 'platform/user/authentication/utilities';

const vaGovFullDomain = environment.BASE_URL;

function loginHandler(loginType) {
  recordEvent({ event: `login-attempted-${loginType}` });
  login(loginType, 'v1');
}

function signupHandler(loginType) {
  recordEvent({ event: `signup-attempted-${loginType}` });
  signup({ version: 'v1', queryParams: { csp: loginType } });
}

export default function SignInButtons({ isDisabled, loginGovEnabled }) {
  return (
    <div>
      {loginGovEnabled && (
        <button
          disabled={isDisabled}
          type="button"
          className="usa-button default"
          onClick={() => loginHandler('logingov')}
        >
          <img
            alt="Sign in with Login.gov"
            src={`${vaGovFullDomain}/img/signin/logingov-icon-white.svg`}
          />
        </button>
      )}
      <button
        disabled={isDisabled}
        type="button"
        className="usa-button default"
        onClick={() => loginHandler('idme')}
      >
        <img
          aria-hidden="true"
          role="presentation"
          alt="Sign in with ID.me"
          src={`${vaGovFullDomain}/img/signin/idme-icon-white.svg`}
        />
      </button>
      <button
        disabled={isDisabled}
        type="button"
        className="usa-button default default-dslogon-icon"
        onClick={() => loginHandler('dslogon')}
      >
        <img
          aria-hidden="true"
          role="presentation"
          alt="Sign in with DS Logon"
          className="dslogon-icon"
          src={`${vaGovFullDomain}/img/signin/dslogon-icon.svg`}
        />
      </button>
      <button
        disabled={isDisabled}
        type="button"
        className="usa-button default default-mhv-icon"
        onClick={() => loginHandler('mhv')}
      >
        <img
          aria-hidden="true"
          role="presentation"
          alt="Sign in with My HealtheVet"
          className="mhv-icon"
          src={`${vaGovFullDomain}/img/signin/mhv-logo-white.svg`}
        />
      </button>
      <span className="sidelines">OR</span>
      <div className="alternate-signin">
        <h2 className="vads-u-font-size--sm vads-u-margin-top--0">
          Don't have those accounts?
        </h2>
        {loginGovEnabled && (
          <button
            disabled={isDisabled}
            className="usa-button usa-button-secondary create-account"
            onClick={() => signupHandler('logingov')}
          >
            Create an account with
            <img
              aria-hidden="true"
              role="presentation"
              alt="ID.me"
              src={`${vaGovFullDomain}/img/signin/login-gov-logo.svg`}
            />
          </button>
        )}
        <button
          disabled={isDisabled}
          className="usa-button usa-button-secondary create-account"
          onClick={() => signupHandler('idme')}
        >
          Create an account with
          <img
            aria-hidden="true"
            role="presentation"
            alt="ID.me"
            src={`${vaGovFullDomain}/img/signin/idme-icon-dark.svg`}
          />
        </button>
      </div>
    </div>
  );
}
