import React, { useEffect, useState } from 'react';
import { externalApplicationsConfig } from '../usip-config';
import {
  EXTERNAL_APPS,
  OCC_MOBILE,
  OCC_MOBILE_DSLOGON_ONLY,
} from '../constants';
import { reduceAllowedProviders, getQueryParams } from '../utilities';
import LoginButton from './LoginButton';
import CreateAccountLink from './CreateAccountLink';

export default function LoginActions({ externalApplication }) {
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
                  externalApplication={externalApplication}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
