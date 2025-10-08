import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { externalApplicationsConfig } from '../usip-config';
import { reduceAllowedProviders, getQueryParams } from '../utilities';
import LoginButton from './LoginButton';

export default function LoginActions({ externalApplication, isUnifiedSignIn }) {
  const [useOAuth, setOAuth] = useState();
  const { OAuth, clientId, codeChallenge, state } = getQueryParams();
  const {
    OAuthEnabled,
    allowedSignInProviders,
    legacySignInProviders: { dslogon },
  } =
    externalApplicationsConfig[externalApplication] ??
    externalApplicationsConfig.default;

  useEffect(
    () => {
      setOAuth(OAuthEnabled && OAuth === 'true');
    },
    [OAuth, OAuthEnabled],
  );

  const actionLocation = isUnifiedSignIn ? 'usip' : 'modal';
  const isValid = dslogon;

  return (
    <div className="row">
      <div className="columns print-full-width sign-in-wrapper">
        {reduceAllowedProviders(allowedSignInProviders).map(csp => (
          <LoginButton
            csp={csp}
            key={csp}
            useOAuth={useOAuth}
            actionLocation={actionLocation}
            queryParams={{ clientId, codeChallenge, state }}
          />
        ))}
        <a href="https://www.va.gov/resources/creating-an-account-for-vagov">
          Learn about creating a Login.gov or ID.me account
        </a>
        {isValid && (
          <div>
            {/* Remove this hardcoded message for MHV */}
            <h2>Other sign-in options</h2>
            <div>
              <h3 id="mhvH3" className="vads-u-margin-top--3">
                My HealtheVet sign-in option
                <span className="vads-u-display--block vads-u-font-size--md vads-u-font-family--sans">
                  This option is no longer available
                </span>
              </h3>
              <va-link
                text="Learn how to access your benefits and set up your new account"
                href="/resources/what-to-do-if-you-havent-switched-to-logingov-or-idme-yet"
              />
            </div>
            {dslogon && (
              <>
                <h3
                  id="dslogonH3"
                  className="vads-u-margin-bottom--0 vads-u-margin-top--3"
                >
                  DS Logon sign-in option
                  <span className="vads-u-display--block vads-u-font-size--md vads-u-font-family--sans">
                    Available through September 30, 2025
                  </span>
                </h3>
                <p>
                  You’ll still be able to use your <strong>DS Logon</strong>{' '}
                  account on Defense Department websites after this date.
                </p>
                <LoginButton
                  csp="dslogon"
                  useOAuth={useOAuth}
                  ariaDescribedBy="dslogonH3"
                  actionLocation={actionLocation}
                />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

LoginActions.propTypes = {
  externalApplication: PropTypes.string,
  isUnifiedSignIn: PropTypes.bool,
};
