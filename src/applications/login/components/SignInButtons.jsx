import React from 'react';

import environment from 'platform/utilities/environment';
import recordEvent from 'platform/monitoring/record-event';
import { login, signup } from 'platform/user/authentication/utilities';
import LoginGovSVG from 'applications/login/components/LoginGov';

const vaGovFullDomain = environment.BASE_URL;

function loginHandler(loginType) {
  recordEvent({ event: `login-attempted-${loginType}` });
  login(loginType, 'v1');
}

export default function SignInButtons({ isDisabled, loginGovEnabled }) {
  return (
    <div>
      {loginGovEnabled && (
        <button
          disabled={isDisabled}
          type="button"
          aria-label="Sign in with Login.gov"
          className="usa-button usa-button-big logingov-button vads-u-margin-y--1p5"
          onClick={() => loginHandler('logingov')}
        >
          <LoginGovSVG />
        </button>
      )}
      <button
        disabled={isDisabled}
        type="button"
        aria-label="Sign in with ID.me"
        className="usa-button usa-button-big idme-button vads-u-margin-y--1p5"
        onClick={() => loginHandler('idme')}
      >
        <img
          alt="Sign in with ID.me"
          src={`${vaGovFullDomain}/img/signin/idme-icon-white.svg`}
        />
      </button>
      <button
        disabled={isDisabled}
        type="button"
        aria-label="Sign in with DS Logon"
        className="usa-button usa-button-big dslogon-button vads-u-margin-y--1p5"
        onClick={() => loginHandler('dslogon')}
      >
        DS Logon
      </button>
      <button
        disabled={isDisabled}
        type="button"
        aria-label="Sign in with My HealtheVet"
        className="usa-button usa-button-big mhv-button vads-u-margin-y--1p5"
        onClick={() => loginHandler('mhv')}
      >
        My HealtheVet
      </button>
      <div id="create-account">
        <h2 className="vads-u-margin-top--3">Or create an account</h2>
        <div className="vads-u-display--flex vads-u-flex-direction--column">
          {loginGovEnabled && (
            <button
              type="button"
              aria-label="Create an account with Login.gov"
              disabled={isDisabled}
              onClick={() => signup({ csp: 'logingov' })}
            >
              Create an account with Login.gov
            </button>
          )}
          <button
            type="button"
            aria-label="Create an account with ID.me"
            disabled={isDisabled}
            onClick={() => signup({ csp: 'idme' })}
          >
            Create an account with ID.me
          </button>
        </div>
      </div>
    </div>
  );
}
