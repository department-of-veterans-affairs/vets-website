import React from 'react';
import PropTypes from 'prop-types';

import { updateStateAndVerifier } from 'platform/utilities/oauth/utilities';

import { defaultWebOAuthOptions } from 'platform/user/authentication/config/constants';
import { verify } from 'platform/user/authentication/utilities';

export const VerifyButton = ({ className, label, image, policy, useOAuth }) => {
  const verifyHandler = () => {
    verify({
      policy,
      useOAuth,
      acr: defaultWebOAuthOptions.acrVerify[policy],
    });

    if (useOAuth) {
      updateStateAndVerifier(policy);
    }
  };

  return (
    <button
      key={policy}
      type="button"
      className={`usa-button ${className}`}
      onClick={() => verifyHandler()}
    >
      <strong>
        Verify with <span className="sr-only">{label}</span>
      </strong>
      {image}
    </button>
  );
};

VerifyButton.propTypes = {
  className: PropTypes.string,
  image: PropTypes.node,
  label: PropTypes.string,
  policy: PropTypes.string,
  useOAuth: PropTypes.bool,
};
