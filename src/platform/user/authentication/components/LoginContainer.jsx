import React from 'react';
import { CSP_IDS } from '../constants';
import LoginButton from './LoginButton';
import CreateAccountLink from './CreateAccountLink';

export default function LoginContainer({
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
        <LoginButton csp={CSP_IDS.LOGIN_GOV} isDisabled={isDisabled} />
      )}
      <LoginButton csp={CSP_IDS.ID_ME} isDisabled={isDisabled} />
      <LoginButton csp={CSP_IDS.DS_LOGON} isDisabled={isDisabled} />
      <LoginButton csp={CSP_IDS.MHV} isDisabled={isDisabled} />
      <div id="create-account">
        <h2 className="vads-u-margin-top--3">Or create an account</h2>
        <div className="vads-u-display--flex vads-u-flex-direction--column">
          {showLoginGov() &&
            loginGovCreateAccountEnabled && (
              <CreateAccountLink
                csp={CSP_IDS.LOGIN_GOV}
                isDisabled={isDisabled}
              />
            )}
          <CreateAccountLink csp={CSP_IDS.ID_ME} isDisabled={isDisabled} />
        </div>
      </div>
    </div>
  );
}
