/* eslint-disable @department-of-veterans-affairs/prefer-button-component */
import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { verify } from 'platform/user/authentication/utilities';
import { isAuthenticatedWithOAuth } from 'platform/user/authentication/selectors';
import { updateStateAndVerifier } from 'platform/utilities/oauth/utilities';
import { defaultWebOAuthOptions } from 'platform/user/authentication/config/constants';
import { SERVICE_PROVIDERS } from 'platform/user/authentication/constants';

export const verifyHandler = ({ policy, useOAuth }) => {
  verify({
    policy,
    useOAuth,
    acr: defaultWebOAuthOptions.acrVerify[policy],
  });

  if (useOAuth) {
    updateStateAndVerifier(policy);
  }
};

export const VerifyIdmeButton = () => {
  const { altImage } = SERVICE_PROVIDERS.idme;
  const useOAuth = useSelector(isAuthenticatedWithOAuth);

  return (
    <button
      type="button"
      className="usa-button idme-verify-button"
      onClick={() => verifyHandler({ policy: 'idme', useOAuth })}
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

export const VerifyLogingovButton = () => {
  const { image } = SERVICE_PROVIDERS.logingov;
  const useOAuth = useSelector(isAuthenticatedWithOAuth);

  return (
    <button
      type="button"
      className="usa-button logingov-verify-button"
      onClick={() => verifyHandler({ policy: 'logingov', useOAuth })}
    >
      <div>
        Verify with <span className="sr-only">Login.gov</span>
        {image}
      </div>
    </button>
  );
};

export const VerifyButton = ({
  className,
  label,
  image,
  policy,
  useOAuth = false,
  onClick = verifyHandler,
}) => {
  return (
    <button
      key={policy}
      type="button"
      className={`usa-button ${className}`}
      onClick={() => onClick({ policy, useOAuth })}
      aria-label={`Verify with ${label}`}
    >
      <strong>
        Verify with <span className="sr-only">{label}</span>
      </strong>
      {image}
    </button>
  );
};

export default VerifyButton;

VerifyButton.propTypes = {
  className: PropTypes.string,
  image: PropTypes.node,
  label: PropTypes.string,
  policy: PropTypes.string,
  useOAuth: PropTypes.bool,
  onClick: PropTypes.func,
};
