import React from 'react';
import PropTypes from 'prop-types';
import FinishVerifyingLater from './FinishVerifyingLater';

export default function ReviewPausedInfo({
  skippedAheadIncorrectMonth,
  onFinishVerifyingLater,
}) {
  return (
    <va-alert-expandable
      class="vads-u-margin-bottom--2"
      status="warning"
      trigger="If you submit this verification, we’ll pause your monthly education payments"
    >
      {/* eslint-disable jsx-a11y/no-noninteractive-tabindex */}
      <div tabIndex="0">
        {skippedAheadIncorrectMonth && (
          <p>
            We skipped you ahead to the review step because you selected “No,
            this information isn’t correct” for {skippedAheadIncorrectMonth}.
          </p>
        )}
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
      </div>
    </va-alert-expandable>
  );
}

ReviewPausedInfo.propTypes = {
  onFinishVerifyingLater: PropTypes.func.isRequired,
  skippedAheadIncorrectMonth: PropTypes.string,
};
