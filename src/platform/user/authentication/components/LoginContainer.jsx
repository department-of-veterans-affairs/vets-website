import React from 'react';

import {
  LoginHeader,
  LoginActions,
  LoginInfo,
} from 'platform/user/authentication/components';
// import { useDatadogRum } from 'platform/user/authentication/hooks/useDatadogRum';
import environment from 'platform/utilities/environment';

const vaGovFullDomain = environment.BASE_URL;
export const logoSrc = `${vaGovFullDomain}/img/design/logo/va-logo.png`;

const LoginContainer = props => {
  const { externalApplication, isUnifiedSignIn, loggedOut } = props;
  // useDatadogRum();

  return (
    <section
      className={`login ${isUnifiedSignIn ? 'login-page' : 'login-modal'}`}
    >
      {!isUnifiedSignIn && (
        <div className="row">
          <div className="columns">
            <div className="logo">
              <img
                alt="VA logo and Seal, U.S. Department of Veterans Affairs"
                className="va-header-logo"
                src={logoSrc}
              />
            </div>
          </div>
        </div>
      )}
      <div className="container">
        <LoginHeader loggedOut={loggedOut} />
        <LoginActions
          externalApplication={externalApplication}
          isUnifiedSignIn={isUnifiedSignIn}
        />
        <LoginInfo />
      </div>
    </section>
  );
};

export default LoginContainer;
