import React from 'react';
import recordEvent from 'platform/monitoring/record-event';
import * as authUtilities from 'platform/user/authentication/utilities';
import LoginGovSVG from 'platform/user/authentication/components/LoginGovSVG';
import IDMeSVG from 'platform/user/authentication/components/IDMeSVG';
import { CSP_IDS } from '../constants';

function loginHandler(loginType) {
  recordEvent({ event: `login-attempted-${loginType}` });
  authUtilities.login({
    policy: loginType,
  });
}

function signupHandler(loginType) {
  recordEvent({ event: `register-link-clicked-${loginType}` });
}

export default function LoginButtons({
  isDisabled,
  externalApplication,
  loginGovEnabled,
  loginGovCreateAccountEnabled,
  loginGovMHVEnabled,
  loginGovMyVAHealthEnabled,
}) {
  const externalLoginGovSupport = {
    mhv: loginGovMHVEnabled,
    myvahealth: loginGovMyVAHealthEnabled,
  };

  const showLoginGov = () => {
    if (!loginGovEnabled) {
      return false;
    }

    if (!Object.keys(externalLoginGovSupport).includes(externalApplication)) {
      return true;
    }

    return externalLoginGovSupport[externalApplication];
  };

  return (
    <div className="columns small-12" id="sign-in-wrapper">
      {showLoginGov() && (
        <button
          disabled={isDisabled}
          type="button"
          aria-label="Sign in with Login.gov"
          className="usa-button logingov-button vads-u-margin-y--1p5 vads-u-padding-y--2"
          data-csp={CSP_IDS.LOGIN_GOV}
          onClick={() => loginHandler(CSP_IDS.LOGIN_GOV)}
        >
          <LoginGovSVG />
        </button>
      )}
      <button
        disabled={isDisabled}
        type="button"
        aria-label="Sign in with ID.me"
        className="usa-button idme-button vads-u-margin-y--1p5 vads-u-padding-y--2"
        data-csp={CSP_IDS.ID_ME}
        onClick={() => loginHandler(CSP_IDS.ID_ME)}
      >
        <IDMeSVG />
      </button>
      <button
        disabled={isDisabled}
        type="button"
        aria-label="Sign in with DS Logon"
        className="usa-button dslogon-button vads-u-margin-y--1p5 vads-u-padding-y--2"
        data-csp={CSP_IDS.DS_LOGON}
        onClick={() => loginHandler(CSP_IDS.DS_LOGON)}
      >
        DS Logon
      </button>
      <button
        disabled={isDisabled}
        type="button"
        aria-label="Sign in with My HealtheVet"
        className="usa-button mhv-button vads-u-margin-y--1p5 vads-u-padding-y--2"
        data-csp={CSP_IDS.MHV}
        onClick={() => loginHandler(CSP_IDS.MHV)}
      >
        My HealtheVet
      </button>
      <div id="create-account">
        <h2 className="vads-u-margin-top--3">Or create an account</h2>
        <div className="vads-u-display--flex vads-u-flex-direction--column">
          {showLoginGov() &&
            loginGovCreateAccountEnabled && (
              <a
                href={authUtilities.loginGovSignupUrl()}
                className="vads-c-action-link--blue logingov"
                disabled={isDisabled}
                onClick={() => signupHandler('logingov')}
              >
                Create an account with Login.gov
              </a>
            )}
          <a
            href={authUtilities.idmeSignupUrl()}
            className="vads-c-action-link--blue"
            disabled={isDisabled}
            onClick={() => signupHandler('idme')}
          >
            Create an account with ID.me
          </a>
        </div>
      </div>
    </div>
  );
}
