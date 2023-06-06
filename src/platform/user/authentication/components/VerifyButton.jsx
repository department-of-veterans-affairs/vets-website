import React from 'react';
import PropTypes from 'prop-types';
import { verify } from 'platform/user/authentication/utilities';
import { updateStateAndVerifier } from 'platform/utilities/oauth/utilities';
import { defaultWebOAuthOptions } from 'platform/user/authentication/config/constants';

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
