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
      <va-alert close-btn-aria-label="Close notification" status="info" visible>
        <h2 id="track-your-status-on-mobile" slot="headline">
          Sign in with your Login.gov or ID.me account
        </h2>
        <div>
          <p className="vads-u-margin-y--0">
            Soon all VA websites will follow a new, more secure sign-in process.
            You’ll need to sign in using your Login.gov or ID.me account. So
            you’re ready for the change, try signing in now with Login.gov or
            ID.me.
          </p>
        </div>
        <div>
          <p className="vads-u-margin-y--0">
            <a href="https://www.va.gov/resources/creating-an-account-for-vagov/">
              Learn more about creating a Login.gov or ID.me account{' '}
            </a>
          </p>
        </div>
      </va-alert>
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
}
