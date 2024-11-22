/* eslint-disable @department-of-veterans-affairs/prefer-button-component */
import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { verify } from 'platform/user/authentication/utilities';
import { isAuthenticatedWithOAuth } from 'platform/user/authentication/selectors';
import { updateStateAndVerifier } from 'platform/utilities/oauth/utilities';
import { defaultWebOAuthOptions } from 'platform/user/authentication/config/constants';
import { SERVICE_PROVIDERS } from 'platform/user/authentication/constants';

export const verifyHandler = ({ policy, useOAuth, queryParams }) => {
  verify({
    policy,
    useOAuth,
    acr: defaultWebOAuthOptions.acrVerify[policy],
    queryParams,
  });

  if (useOAuth) {
    updateStateAndVerifier(policy);
  }
};

/**
 *
 * @returns The updated design of the ID.me identity-verification button
 */
export const VerifyIdmeButton = ({ queryParams }) => {
  const { altImage, policy } = SERVICE_PROVIDERS.idme;
  const useOAuth = useSelector(isAuthenticatedWithOAuth);

  return (
    <button
      type="button"
      className="usa-button idme-verify-button"
      onClick={() => verifyHandler({ policy, useOAuth, queryParams })}
    >
      <span>
        <svg viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10.5 21C4.7 21 0 16.3 0 10.5C0 4.7 4.7 0 10.5 0C12.4 0 14.3 0.5 16 1.6C16.5 1.9 16.7 2.6 16.4 3.1C16.1 3.6 15.4 3.8 14.9 3.5C13.6 2.7 12.1 2.3 10.6 2.3C6 2.3 2.3 6 2.3 10.6C2.3 15.2 6 18.9 10.6 18.9C15.2 18.9 18.9 15.2 18.9 10.6C18.9 10 18.8 9.4 18.6 8.7C18.5 8.1 18.8 7.5 19.4 7.4C20 7.3 20.6 7.6 20.7 8.2C20.9 9.1 21 9.9 21 10.6C21 16.3 16.3 21 10.5 21Z"
            fill="#fff"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.5004 13.7L21.7004 2.9C22.2004 2.5 22.2004 1.8 21.7004 1.3C21.2004 0.9 20.5004 0.9 20.1004 1.3L9.80039 11.3L7.00039 8.7C6.50039 8.3 5.80039 8.3 5.40039 8.7C4.90039 9.1 4.90039 9.8 5.40039 10.3L8.90039 13.7C9.10039 13.9 9.40039 14 9.70039 14C10.0004 14 10.3004 13.9 10.5004 13.7Z"
            fill="#fff"
          />
        </svg>
      </span>{' '}
      <div>
        Verify with <span className="sr-only">ID.me</span>
        {altImage}
      </div>
    </button>
  );
};

/**
 *
 * @returns The updated design of the Login.gov identity-verification buttion
 */
export const VerifyLogingovButton = ({ queryParams }) => {
  const { image, policy } = SERVICE_PROVIDERS.logingov;
  const useOAuth = useSelector(isAuthenticatedWithOAuth);

  return (
    <button
      type="button"
      className="usa-button logingov-verify-button"
      onClick={() => verifyHandler({ policy, useOAuth, queryParams })}
    >
      <div>
        Verify with <span className="sr-only">Login.gov</span>
        {image}
      </div>
    </button>
  );
};

/**
 *
 * @param {Object} config - The configuration
 * @param {String} config.csp - The credential service provider to verify with: `logingov` or `idme`
 * @param {String} config.onClick - Used for unit-testing: DO NOT OVERWRITE
 * @returns A button with just the Login.gov or ID.me logo that is used to start the identity-verification process
 */
export const VerifyButton = ({ csp, onClick = verifyHandler, queryParams }) => {
  const { image, label } = SERVICE_PROVIDERS[csp];
  const useOAuth = useSelector(isAuthenticatedWithOAuth);
  const className = `usa-button ${csp}-verify-buttons`;
  return (
    <button
      key={csp}
      type="button"
      className={className}
      onClick={() => onClick({ policy: csp, useOAuth, queryParams })}
    >
      <span className="sr-only">Verify with {label}</span>
      {image}
    </button>
  );
};

VerifyButton.propTypes = {
  csp: PropTypes.string.isRequired,
  queryParams: PropTypes.object,
  onClick: PropTypes.func,
};
