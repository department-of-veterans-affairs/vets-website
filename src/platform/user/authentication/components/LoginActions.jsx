import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { externalApplicationsConfig } from '../usip-config';
import { reduceAllowedProviders, getQueryParams } from '../utilities';
import LoginButton from './LoginButton';

export default function LoginActions({ externalApplication, isUnifiedSignIn }) {
  const [useOAuth, setOAuth] = useState();
  const { OAuth, clientId, codeChallenge, state } = getQueryParams();

  const { OAuthEnabled, allowedSignInProviders } =
    externalApplicationsConfig[externalApplication] ??
    externalApplicationsConfig.default;

  const actionLocation = isUnifiedSignIn ? 'usip' : 'modal';

  useEffect(
    () => {
      setOAuth(OAuthEnabled && OAuth === 'true');
    },
    [OAuth, OAuthEnabled],
  );

  return (
    <div className="row">
      <div className="columns print-full-width sign-in-wrapper">
        {reduceAllowedProviders(allowedSignInProviders).map(csp => (
          <LoginButton
            key={csp}
            csp={csp}
            useOAuth={useOAuth}
            actionLocation={actionLocation}
            queryParams={{ clientId, codeChallenge, state }}
          />
        ))}

        <a href="https://www.va.gov/resources/creating-an-account-for-vagov">
          Learn about creating an ID.me or Login.gov account
        </a>

        <h2>Other sign-in option</h2>
        <div>
          <h3 className="vads-u-margin-top--3">
            DS Logon sign-in option
            <span className="vads-u-display--block vads-u-font-size--md vads-u-font-family--sans">
              This option is no longer available
            </span>
          </h3>
          <va-link
            text="Learn how to access your benefits and set up your new account"
            href="/resources/what-to-do-if-you-havent-switched-to-logingov-or-idme-yet"
          />
        </div>
      </div>
    </div>
  );
}

LoginActions.propTypes = {
  externalApplication: PropTypes.string,
  isUnifiedSignIn: PropTypes.bool,
};
