import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { externalApplicationsConfig } from '../usip-config';
import { reduceAllowedProviders, getQueryParams } from '../utilities';
import LoginButton from './LoginButton';
import LoginNote from './LoginNote';

export default function LoginActions({ externalApplication, isUnifiedSignIn }) {
  const mhvButtonDeprecated = useSelector(
    state => state?.featureToggles?.mhvCredentialButtonDisabled,
  );
  const [useOAuth, setOAuth] = useState();
  const [oktaParams, setOktaParams] = useState({});
  const {
    OAuth,
    clientId,
    codeChallenge,
    codeChallengeMethod,
  } = getQueryParams();
  const {
    OAuthEnabled,
    allowedSignInProviders,
    legacySignInProviders: { mhv, dslogon },
  } =
    externalApplicationsConfig[externalApplication] ??
    externalApplicationsConfig.default;

  useEffect(
    () => {
      setOAuth(OAuthEnabled && OAuth === 'true');
      if (clientId === 'okta_test') {
        setOktaParams({ clientId, codeChallenge, codeChallengeMethod });
      }
    },
    [OAuth, OAuthEnabled, clientId, codeChallenge, codeChallengeMethod],
  );

  const actionLocation = isUnifiedSignIn ? 'usip' : 'modal';
  const isValid = mhv || dslogon;
  const mhvButtonShouldDisplay = mhvButtonDeprecated;

  return (
    <div className="row">
      <div className="columns print-full-width sign-in-wrapper">
        {reduceAllowedProviders(allowedSignInProviders).map(csp => (
          <LoginButton
            csp={csp}
            key={csp}
            useOAuth={useOAuth}
            actionLocation={actionLocation}
            queryParams={oktaParams}
          />
        ))}
        <LoginNote />
        {isValid && (
          <div>
            <h2>Other sign-in options</h2>
            {!mhvButtonShouldDisplay && (
              <>
                <h3 id="mhvH3">
                  My HealtheVet sign-in option
                  <span className="vads-u-display--block vads-u-font-size--md vads-u-font-family--sans">
                    Available through March 4, 2025
                  </span>
                </h3>
                <p>
                  You’ll still be able to use the <strong>My HealtheVet</strong>{' '}
                  website after this date. You’ll just need to start signing in
                  with a <strong>Login.gov</strong> or <strong>ID.me</strong>{' '}
                  account.
                </p>
                <LoginButton
                  csp="mhv"
                  useOAuth={useOAuth}
                  ariaDescribedBy="mhvH3"
                  actionLocation={actionLocation}
                />
                <va-link
                  text="Learn how to access your benefits and set up your new account"
                  href="/resources/what-to-do-if-you-havent-switched-to-logingov-or-idme-yet"
                />
              </>
            )}
            {mhvButtonDeprecated && (
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
            )}
            {dslogon && (
              <>
                <h3
                  id="dslogonH3"
                  className="vads-u-margin-bottom--0 vads-u-margin-top--3"
                >
                  DS Logon sign-in option
                  <span className="vads-u-display--block vads-u-font-size--md vads-u-font-family--sans">
                    {mhvButtonDeprecated
                      ? 'We’ll remove this option after September 30, 2025'
                      : 'Available through September 30, 2025'}
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
  externalApplication: PropTypes.object,
  isUnifiedSignIn: PropTypes.bool,
};
