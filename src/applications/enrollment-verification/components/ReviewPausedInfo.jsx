import React from 'react';
import PropTypes from 'prop-types';
import FinishVerifyingLater from './FinishVerifyingLater';

export default function ReviewPausedInfo({ onFinishVerifyingLater }) {
  return (
    <va-alert
      background-only
      class="vads-u-margin-bottom--2"
      close-btn-aria-label="Close notification"
      show-icon
      status="warning"
      visible
    >
      <va-additional-info trigger="If you submit this verification, we'll pause your monthly education payments">
        <p>
          If you submit this verification, we will pause your monthly payments
          until your enrollment information is corrected.
        </p>
        <p>
          <strong>
            You can update your enrollment information before you submit your
            verification:
          </strong>
        </p>
        <ul>
          <li>
            Work with your School Certifying Official (SCO) to make sure they
            have the correct enrollment information and can update the
            information on file.
          </li>
          <li>
            After your information is corrected, verify the corrected
            information.
          </li>
        </ul>
        <FinishVerifyingLater onFinishVerifyingLater={onFinishVerifyingLater} />
      </va-additional-info>
    </va-alert>
  );
}

ReviewPausedInfo.propTypes = {
  onFinishVerifyingLater: PropTypes.func.isRequired,
};
