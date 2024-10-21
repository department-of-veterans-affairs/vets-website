import React from 'react';

import {
  LoginHeader,
  LoginActions,
  LoginInfo,
} from 'platform/user/authentication/components';
import environment from 'platform/utilities/environment';
import { useDatadogRum } from 'platform/user/authentication/hooks';

const vaGovFullDomain = environment.BASE_URL;
export const logoSrc = `${vaGovFullDomain}/img/design/logo/va-logo.png`;

const LoginContainer = props => {
  const { externalApplication, isUnifiedSignIn, loggedOut } = props;

  useDatadogRum();

  return (
    <section className="login">
      <div className="container">
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
      </div>
    </section>
  );
};

export default LoginContainer;
