import React from 'react';

import environment from 'platform/utilities/environment';
import { EXTERNAL_APPS } from '../constants';
import LoginHeader from './LoginHeader';
import LoginActions from './LoginActions';
import LoginInfo from './LoginInfo';
import { useInternalTestingAuth } from '../hooks/index';

const vaGovFullDomain = environment.BASE_URL;

const LoginContainer = props => {
  const logoSrc = `${vaGovFullDomain}/img/design/logo/va-logo.png`;
  const { externalApplication, isUnifiedSignIn } = props;
  const isOccMobile = [EXTERNAL_APPS.VA_OCC_MOBILE]?.includes(
    externalApplication,
  );
  const { href } = useInternalTestingAuth();

  return (
    <>
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
          <LoginHeader />
          <LoginActions
            externalApplication={externalApplication}
            isUnifiedSignIn={isUnifiedSignIn}
          />
          <LoginInfo />
        </div>
      </section>
      {isUnifiedSignIn &&
        isOccMobile && (
          <div>
            <va-accordion disabled-analytics open-single>
              <va-accordion-item>
                <a href={href}>Internal testing only</a>
              </va-accordion-item>
            </va-accordion>
          </div>
        )}
    </>
  );
};

export default LoginContainer;
