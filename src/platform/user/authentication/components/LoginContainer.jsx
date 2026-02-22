import React from 'react';
import PropTypes from 'prop-types';

import environment from 'platform/utilities/environment';
import { useFeatureToggle } from 'platform/utilities/feature-toggles/useFeatureToggle';
import { EXTERNAL_APPS } from '../constants';
import { useInternalTestingAuth } from '../hooks';
import LoginHeader from './LoginHeader';
import LoginActions from './LoginActions';
import LoginInfo from './LoginInfo';

const vaGovFullDomain = environment.BASE_URL;
export const logoSrc = `${vaGovFullDomain}/img/design/logo/va-logo.png`;

export default function LoginContainer({
  externalApplication,
  isUnifiedSignIn,
}) {
  const isOccMobile = [EXTERNAL_APPS.VA_OCC_MOBILE]?.includes(
    externalApplication,
  );
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const ial2Enforcement = useToggleValue(
    TOGGLE_NAMES.identityIal2FullEnforcement,
  );
  const { href, onClick } = useInternalTestingAuth({ ial2Enforcement });

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
        {isUnifiedSignIn &&
          isOccMobile && (
            <div className="row">
              <div className="columns">
                <va-link href={href} text="VA staff" onClick={onClick} />
              </div>
            </div>
          )}
      </section>
    </>
  );
}

LoginContainer.propTypes = {
  externalApplication: PropTypes.string,
  isUnifiedSignIn: PropTypes.bool,
};
