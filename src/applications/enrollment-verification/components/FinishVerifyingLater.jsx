import React from 'react';
import PropTypes from 'prop-types';
import { REVIEW_ENROLLMENTS_URL } from '../constants';

export default function FinishVerifyingLater({ onFinishVerifyingLater }) {
  return (
    <a
      className="ev-finish-later vads-u-margin-top--4"
      href={REVIEW_ENROLLMENTS_URL}
      onClick={onFinishVerifyingLater}
    >
      Cancel verification and exit
    </a>
  );
}

FinishVerifyingLater.propTypes = {
  onFinishVerifyingLater: PropTypes.func.isRequired,
};
