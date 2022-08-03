import React from 'react';
import PropTypes from 'prop-types';

import { verify } from 'platform/user/authentication/utilities';

export const VerifyButton = ({ className, copy, renderImage, policy }) => {
  return (
    <button
      key={policy}
      type="button"
      className={`usa-button ${className}`}
      onClick={() => verify({ policy })}
    >
      <strong>
        Verify with <span className="sr-only">{copy}</span>
      </strong>
      {renderImage}
    </button>
  );
};

VerifyButton.propTypes = {
  className: PropTypes.string,
  copy: PropTypes.string,
  policy: PropTypes.string,
  renderImage: PropTypes.node,
};
