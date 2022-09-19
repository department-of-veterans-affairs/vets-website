import React from 'react';
import PropTypes from 'prop-types';
import { verify } from 'platform/user/authentication/utilities';
import { updateStateAndVerifier } from 'platform/utilities/oauth/utilities';

import { defaultWebOAuthOptions } from 'platform/user/authentication/config/constants';

export const verifyHandler = async ({ useOAuth = false, policy }) => {
  if (useOAuth) {
    updateStateAndVerifier(policy);
  }
  await verify({
    policy,
    useOAuth,
    acr: defaultWebOAuthOptions.acrVerify[policy],
  });
};

export const VerifyButton = ({
  className,
  label,
  image,
  policy,
  useOAuth,
  onClick,
}) => {
  const onVerifyClick = onClick ?? verifyHandler;
  return (
    <button
      key={policy}
      type="button"
      className={`usa-button ${className}`}
      onClick={() => onVerifyClick({ useOAuth, policy })}
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
