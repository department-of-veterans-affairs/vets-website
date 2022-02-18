import React from 'react';

export default function ReviewPausedInfo() {
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
          You can update your enrollment information before you submit your
          verification:
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
      </va-additional-info>
    </va-alert>
  );
}
