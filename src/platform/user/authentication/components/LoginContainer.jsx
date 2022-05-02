import React from 'react';
import { connect } from 'react-redux';

import {
  loginGovDisabled,
  loginGovCreateAccount,
  loginGovMyVAHealth,
} from 'platform/user/authentication/selectors';
import {
  LoginHeader,
  LoginActions,
  LoginInfo,
} from 'platform/user/authentication/components';
import environment from 'platform/utilities/environment';

const vaGovFullDomain = environment.BASE_URL;
export const logoSrc = `${vaGovFullDomain}/img/design/logo/va-logo.png`;

export const LoginContainer = props => {
  const {
    externalApplication,
    isUnifiedSignIn,
    loggedOut,
    loginGovOff,
    loginGovCreateAccountEnabled,
    loginGovMyVAHealthEnabled,
  } = props;

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
          <LoginActions
            externalApplication={externalApplication}
            loginGovOff={loginGovOff}
            loginGovMyVAHealthEnabled={loginGovMyVAHealthEnabled}
            loginGovCreateAccountEnabled={loginGovCreateAccountEnabled}
          />
          <LoginInfo />
        </div>
      </div>
    </section>
  );
};

function mapStateToProps(state) {
  return {
    loginGovOff: loginGovDisabled(state),
    loginGovMyVAHealthEnabled: loginGovMyVAHealth(state),
    loginGovCreateAccountEnabled: loginGovCreateAccount(state),
  };
}

export default connect(mapStateToProps)(LoginContainer);
