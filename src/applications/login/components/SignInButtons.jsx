import React from 'react';

import environment from 'platform/utilities/environment';
import recordEvent from 'platform/monitoring/record-event';
import { login, signup } from 'platform/user/authentication/utilities';

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
          type="link"
          aria-label="Sign in with Login.gov"
          className="usa-button usa-button-big logingov-button vads-u-margin-y--1p5"
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
        type="link"
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
        type="link"
        aria-label="Sign in with DS Logon"
        className="usa-button usa-button-big dslogon-button vads-u-margin-y--1p5"
        onClick={() => loginHandler('dslogon')}
      >
        DS Logon
      </button>
      <button
        disabled={isDisabled}
        type="link"
        aria-label="Sign in with My HealtheVet"
        className="usa-button usa-button-big mhv-button vads-u-margin-y--1p5"
        onClick={() => loginHandler('mhv')}
      >
        My HealtheVet
      </button>
      <div className="alternate-signin">
        <h2 className="vads-u-margin-top--3">Or create an account</h2>
        <div className="vads-u-display--flex vads-u-flex-direction--column">
          {loginGovEnabled && (
            <a
              role="link"
              tabIndex="0"
              aria-label="Create an account with Login.gov. Navigates to Login.gov website"
              disabled={isDisabled}
              className="vads-c-action-link--blue vads-u-border-top--1px vads-u-padding-bottom--2"
              onClick={() =>
                signup({ version: 'v1', queryParams: { csp: 'logingov' } })
              }
            >
              Create an account with Login.gov
            </a>
          )}
          <a
            role="link"
            tabIndex="0"
            aria-label="Create an account with ID.me. Navigates to ID.me website"
            disabled={isDisabled}
            className="vads-c-action-link--blue vads-u-border-top--1px vads-u-padding-bottom--2 vads-u-border-bottom--1px"
            onClick={() =>
              signup({ version: 'v1', queryParams: { csp: 'idme' } })
            }
          >
            Create an account with ID.me
          </a>
        </div>
        {loginGovEnabled && (
          <a
            className="vads-u-display--block vads-u-margin-top--2"
            href="#"
            target="_blank"
          >
            Learn more about choosing an account
          </a>
        )}
      </div>
    </div>
  );
}
