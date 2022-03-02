import React from 'react';
import PropTypes from 'prop-types';
import { formatReadableMonthYear } from '../helpers';

export default function ReviewSkippedAheadAlert({ incorrectMonth }) {
  return (
    <va-alert
      background-only
      class="vads-u-margin-bottom--2"
      close-btn-aria-label="Close notification"
      status="info"
      visible
    >
      We skipped you ahead to the review step because you selected "No, this
      information isn’t correct" for {formatReadableMonthYear(incorrectMonth)}.
    </va-alert>
  );
}

ReviewSkippedAheadAlert.propTypes = {
  incorrectMonth: PropTypes.string.isRequired,
};
