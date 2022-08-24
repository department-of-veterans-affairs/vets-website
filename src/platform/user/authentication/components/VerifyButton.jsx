import React from 'react';
import PropTypes from 'prop-types';
import { SERVICE_PROVIDERS } from 'platform/user/authentication/constants';
import { verify } from 'platform/user/authentication/utilities';

export const selectCSP = selectedPolicy =>
  Object.values(SERVICE_PROVIDERS).find(csp => csp.policy === selectedPolicy);

export const VerifyButton = ({ className, label, image, policy }) => {
  return (
    <button
      key={policy}
      type="button"
      className={`usa-button ${className}`}
      onClick={() => verify({ policy })}
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
};
