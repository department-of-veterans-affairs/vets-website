import React from 'react';

import environment from 'platform/utilities/environment';
import recordEvent from 'platform/monitoring/record-event';
import { login, signup } from 'platform/user/authentication/utilities';

const vaGovFullDomain = environment.BASE_URL;

function loginHandler(loginType, application = null, redirect = null) {
  recordEvent({ event: `login-attempted-${loginType}` });
  login(loginType, 'v1', application, redirect);
}

function signupHandler(application = null, redirect = null) {
  signup('v1', application, redirect);
}

export default function SignInButtons({ isDisabled, application, redirect }) {
  return (
    <div>
      <button
        disabled={isDisabled}
        className="dslogon"
        onClick={() => loginHandler('dslogon', application, redirect)}
      >
        <img
          alt="DS Logon"
          src={`${vaGovFullDomain}/img/signin/dslogon-icon.svg`}
        />
        <strong> Sign in with DS Logon</strong>
      </button>
      <button
        disabled={isDisabled}
        className="mhv"
        onClick={() => loginHandler('mhv', application, redirect)}
      >
        <img
          alt="My HealtheVet"
          src={`${vaGovFullDomain}/img/signin/mhv-icon.svg`}
        />
        <strong> Sign in with My HealtheVet</strong>
      </button>
      <button
        disabled={isDisabled}
        className="usa-button-primary va-button-primary"
        onClick={() => loginHandler('idme', application, redirect)}
      >
        <img
          alt="ID.me"
          src={`${vaGovFullDomain}/img/signin/idme-icon-white.svg`}
        />
        <strong> Sign in with ID.me</strong>
      </button>
      <span className="sidelines">OR</span>
      <div className="alternate-signin">
        <h5>Don't have those accounts?</h5>
        <button
          disabled={isDisabled}
          className="idme-create usa-button usa-button-secondary"
          onClick={() => signupHandler(application, redirect)}
        >
          <img
            alt="ID.me"
            src={`${vaGovFullDomain}/img/signin/idme-icon-dark.svg`}
          />
          <strong> Create an ID.me account</strong>
        </button>
        <p>Use your email, Google, or Facebook</p>
      </div>
    </div>
  );
}
