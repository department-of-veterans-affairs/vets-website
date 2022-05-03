import React from 'react';
import { CSP_IDS, EXTERNAL_APPS } from '../constants';
import LoginButton from './LoginButton';
import AccountLink from './AccountLink';

export default ({ externalApplication }) => {
  const externalLoginGovSupport = {
    [EXTERNAL_APPS.MHV]: true,
    [EXTERNAL_APPS.MY_VA_HEALTH]: true,
    [EXTERNAL_APPS.VA_FLAGSHIP_MOBILE]: true,
    [EXTERNAL_APPS.VA_OCC_MOBILE]: true,
    [EXTERNAL_APPS.EBENEFITS]: true,
  };

  const showLoginGov = () => {
    if (!Object.keys(externalLoginGovSupport).includes(externalApplication)) {
      return true;
    }

    return externalLoginGovSupport[externalApplication];
  };

  return (
    <div className="row">
      <div className="columns small-12" id="sign-in-wrapper">
        {showLoginGov() && <LoginButton csp={CSP_IDS.LOGIN_GOV} />}
        <LoginButton csp={CSP_IDS.ID_ME} />
        <LoginButton csp={CSP_IDS.DS_LOGON} />
        <LoginButton csp={CSP_IDS.MHV} />
        <div id="create-account">
          <h2 className="vads-u-margin-top--3">Or create an account</h2>
          <div className="vads-u-display--flex vads-u-flex-direction--column">
            {showLoginGov() && <AccountLink csp={CSP_IDS.LOGIN_GOV} />}
            <AccountLink csp={CSP_IDS.ID_ME} />
          </div>
        </div>
      </div>
    </div>
  );
};
