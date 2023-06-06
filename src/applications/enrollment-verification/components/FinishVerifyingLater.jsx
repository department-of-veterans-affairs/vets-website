import React from 'react';
import PropTypes from 'prop-types';
import { REVIEW_ENROLLMENTS_URL } from '../constants';

export default function FinishVerifyingLater({
  className,
  onFinishVerifyingLater,
}) {
  return (
    <a
      className={`ev-finish-later ${className}`}
      href={REVIEW_ENROLLMENTS_URL}
      onClick={onFinishVerifyingLater}
    >
      Cancel verification and exit
    </a>
  );
}

FinishVerifyingLater.propTypes = {
  onFinishVerifyingLater: PropTypes.func.isRequired,
  className: PropTypes.string,
};
