import React from 'react';
import environment from 'platform/utilities/environment';
import LoginHeader from './LoginHeader';
import LoginActions from './LoginActions';
import LoginInfo from './LoginInfo';

export const logoSrc = `${environment.BASE_URL}/img/design/logo/va-logo.png`;

export default function LoginContainer({
  externalApplication,
  isUnifiedSignIn,
  loggedOut,
}) {
  return (
    <section className="login">
      <div className="container">
        {!isUnifiedSignIn && (
          <div className="row">
            <div className="columns">
              <div className="logo">
                <img alt="VA.gov" className="va-header-logo" src={logoSrc} />
              </div>
            </div>
          </div>
        )}
        <div className="container">
          <LoginHeader loggedOut={loggedOut} />
          <LoginActions externalApplication={externalApplication} />
          <LoginInfo />
        </div>
      </div>
    </section>
  );
}
