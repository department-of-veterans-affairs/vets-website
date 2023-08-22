import React, { useEffect, useState } from 'react';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { externalApplicationsConfig } from '../usip-config';
import {
  EXTERNAL_APPS,
  OCC_MOBILE,
  OCC_MOBILE_DSLOGON_ONLY,
} from '../constants';
import { reduceAllowedProviders, getQueryParams } from '../utilities';
import LoginButton from './LoginButton';
import CreateAccountLink from './CreateAccountLink';
import SignInAlertBox from './SignInAlertBox';

export const LoginActions = ({
  showsignInPageAndModalExperiment,
  externalApplication,
}) => {
  const [useOAuth, setOAuth] = useState();
  const { OAuth, redirectUri } = getQueryParams();
  const { allowedSignInProviders, allowedSignUpProviders, OAuthEnabled } =
    externalApplicationsConfig[externalApplication] ??
    externalApplicationsConfig.default;

  useEffect(
    () => {
      setOAuth(OAuthEnabled && OAuth === 'true');
    },
    [OAuth, OAuthEnabled],
  );
  const isRedirectUriPresent =
    externalApplication?.includes(EXTERNAL_APPS.VA_OCC_MOBILE) &&
    redirectUri &&
    OCC_MOBILE_DSLOGON_ONLY.includes(redirectUri);
  const isRegisteredApp =
    externalApplication?.includes(EXTERNAL_APPS.VA_OCC_MOBILE) &&
    isRedirectUriPresent
      ? OCC_MOBILE.REGISTERED_APPS
      : OCC_MOBILE.DEFAULT;

  return (
    <div className="row">
      {showsignInPageAndModalExperiment && <SignInAlertBox />}
      <div className="columns small-12" id="sign-in-wrapper">
        {reduceAllowedProviders(allowedSignInProviders, isRegisteredApp).map(
          csp => (
            <LoginButton csp={csp} key={csp} useOAuth={useOAuth} />
          ),
        )}
        {externalApplication?.includes(EXTERNAL_APPS.VA_OCC_MOBILE) &&
        isRegisteredApp === OCC_MOBILE.REGISTERED_APPS ? null : (
          <div id="create-account">
            <h2 className="vads-u-margin-top--3">Or create an account</h2>
            <div className="vads-u-display--flex vads-u-flex-direction--column">
              {reduceAllowedProviders(
                allowedSignUpProviders,
                externalApplication?.includes(EXTERNAL_APPS.VA_OCC_MOBILE) &&
                isRegisteredApp === OCC_MOBILE.DEFAULT
                  ? OCC_MOBILE.DEFAULT
                  : '',
              ).map(policy => (
                <CreateAccountLink
                  key={policy}
                  policy={policy}
                  useOAuth={useOAuth}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

LoginActions.propTypes = {
  showsignInPageAndModalExperiment: PropTypes.bool,
};

const mapStateToProps = state => ({
  showsignInPageAndModalExperiment: toggleValues(state)[
    FEATURE_FLAG_NAMES.signInPageAndModalExperimentLga
  ],
});

export default connect(mapStateToProps)(LoginActions);
