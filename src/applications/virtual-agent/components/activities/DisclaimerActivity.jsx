import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const DisclaimerActivity = ({ text, className, variant = 'ai' }) => (
  <div
    className={classNames(
      'va-disclaimer',
      `va-disclaimer--${variant}`,
      className,
    )}
    role="note"
    aria-live="polite"
  >
    <p className="va-disclaimer__body">{text}</p>
  </div>
);

DisclaimerActivity.propTypes = {
  className: PropTypes.string,
  text: PropTypes.string,
  variant: PropTypes.string,
};

export default DisclaimerActivity;
