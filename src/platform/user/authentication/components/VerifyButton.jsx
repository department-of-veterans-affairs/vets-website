/* eslint-disable @department-of-veterans-affairs/prefer-button-component */
import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { verify } from 'platform/user/authentication/utilities';
import { updateStateAndVerifier } from 'platform/utilities/oauth/utilities';
import {
  defaultWebOAuthOptions,
  ial2DefaultWebOAuthOptions,
} from 'platform/user/authentication/config/constants';
import { SERVICE_PROVIDERS } from 'platform/user/authentication/constants';
import { isAuthenticatedWithOAuth } from 'platform/user/authentication/selectors';
import { useFeatureToggle } from 'platform/utilities/feature-toggles/useFeatureToggle';

export const verifyHandler = ({
  ial2Enforcement,
  policy,
  queryParams,
  useOAuth,
}) => {
  verify({
    policy,
    acr: ial2Enforcement
      ? ial2DefaultWebOAuthOptions.acrVerify[policy]
      : defaultWebOAuthOptions.acrVerify[policy],
    queryParams,
    useOAuth,
    ial2Enforcement,
  });

  if (useOAuth) {
    updateStateAndVerifier(policy);
  }
};

/**
 *
 * @returns The updated design of the ID.me identity-verification button
 */
export const VerifyIdmeButton = ({ queryParams, useOAuth = true }) => {
  const { altImage, policy } = SERVICE_PROVIDERS.idme;
  const forceOAuth = useSelector(isAuthenticatedWithOAuth) || useOAuth;
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const idmeEnforcement = useToggleValue(
    TOGGLE_NAMES.identityIdmeIal2Enforcement,
  );
  const fullIal2Enforcement = useToggleValue(
    TOGGLE_NAMES.identityIal2FullEnforcement,
  );
  const ial2Enforcement = fullIal2Enforcement || idmeEnforcement;

  return (
    <button
      type="button"
      className="usa-button idme-verify-button"
      onClick={() =>
        verifyHandler({
          ial2Enforcement,
          policy,
          useOAuth: forceOAuth,
          queryParams,
        })
      }
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
      </span>
      <div>Verify with {altImage}</div>
    </button>
  );
};

/**
 *
 * @returns The updated design of the Login.gov identity-verification button
 */
export const VerifyLogingovButton = ({ queryParams, useOAuth = true }) => {
  const { image, policy } = SERVICE_PROVIDERS.logingov;
  const forceOAuth = useSelector(isAuthenticatedWithOAuth) || useOAuth;
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const logingovEnforcement = useToggleValue(
    TOGGLE_NAMES.identityLogingovIal2Enforcement,
  );
  const fullIal2Enforcement = useToggleValue(
    TOGGLE_NAMES.identityIal2FullEnforcement,
  );
  const ial2Enforcement = fullIal2Enforcement || logingovEnforcement;

  return (
    <button
      type="button"
      className="usa-button logingov-verify-button"
      onClick={() =>
        verifyHandler({
          ial2Enforcement,
          policy,
          queryParams,
          useOAuth: forceOAuth,
        })
      }
    >
      <div>Verify with {image}</div>
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
export const VerifyButton = ({
  csp,
  onClick = verifyHandler,
  queryParams,
  useOAuth = false,
}) => {
  const { image, policy } = SERVICE_PROVIDERS[csp];
  const className = `usa-button ${csp}-verify-buttons`;
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const logingovEnforcement =
    useToggleValue(TOGGLE_NAMES.identityLogingovIal2Enforcement) &&
    policy === SERVICE_PROVIDERS.logingov.policy;
  const idmeEnforcement =
    useToggleValue(TOGGLE_NAMES.identityIdmeIal2Enforcement) &&
    policy === SERVICE_PROVIDERS.idme.policy;
  const fullIal2Enforcement = useToggleValue(
    TOGGLE_NAMES.identityIal2FullEnforcement,
  );
  const ial2Enforcement =
    fullIal2Enforcement || logingovEnforcement || idmeEnforcement;

  return (
    <button
      key={csp}
      type="button"
      className={className}
      onClick={() =>
        onClick({ ial2Enforcement, policy: csp, queryParams, useOAuth })
      }
    >
      <span className="sr-only">Verify with</span>
      {image}
    </button>
  );
};

VerifyIdmeButton.propTypes = {
  queryParams: PropTypes.object,
  useOAuth: PropTypes.bool,
  onClick: PropTypes.func,
};

VerifyLogingovButton.propTypes = {
  queryParams: PropTypes.object,
  useOAuth: PropTypes.bool,
  onClick: PropTypes.func,
};

VerifyButton.propTypes = {
  csp: PropTypes.string.isRequired,
  queryParams: PropTypes.object,
  useOAuth: PropTypes.bool,
  onClick: PropTypes.func,
};
