import React from 'react';
import PropTypes from 'prop-types';

import { updateStateAndVerifier } from 'platform/utilities/oauth/utilities';

import { signupOrVerify } from 'platform/user/authentication/utilities';

export const VerifyButton = ({ className, label, image, policy, useOAuth }) => {
  const verifyHandler = async () => {
    const url = await signupOrVerify({
      policy,
      allowVerification: true,
      isSignup: false,
      isLink: true,
      useOAuth,
    });

    if (useOAuth) {
      updateStateAndVerifier(policy);
    }

    window.location = url;
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
