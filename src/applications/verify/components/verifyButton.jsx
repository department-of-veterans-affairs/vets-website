import React from 'react';
import PropTypes from 'prop-types';

import { verify } from 'platform/user/authentication/utilities';

export const VerifyButton = ({ className, label, image, policy, useOAuth }) => {
  return (
    <button
      key={policy}
      type="button"
      className={`usa-button ${className}`}
      onClick={() => verify({ policy, useOAuth })}
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
