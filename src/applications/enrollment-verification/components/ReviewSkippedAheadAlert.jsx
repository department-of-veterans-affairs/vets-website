import React from 'react';

export default function ReviewSkippedAheadAlert() {
  return (
    <va-alert
      background-only
      class="vads-u-margin-bottom--2"
      close-btn-aria-label="Close notification"
      status="info"
      visible
    >
      We skipped you ahead to the review step because you selected "No, this
      information is incorrect" for September 2021.
    </va-alert>
  );
}
