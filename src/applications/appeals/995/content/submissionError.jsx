import React from 'react';

import recordEvent from 'platform/monitoring/record-event';

const submissionError = ({ form }) => {
  recordEvent({
    event: 'visible-alert-box',
    'alert-box-type': 'error',
    'alert-box-heading': 'Your decision review request didn’t go through',
    'error-key': 'submission_failure',
    'alert-box-full-width': false,
    'alert-box-background-only': false,
    'alert-box-closeable': false,
    'reason-for-alert': 'Submission failure',
  });

  return (
    <va-alert status="error" class="vads-u-margin-bottom--4">
      <h3 slot="headline">Your decision review request didn’t go through</h3>
      <p>
        We’re sorry. We’re working to fix the problem, but it may take us a
        while. Please try again tomorrow.
      </p>
      <p>
        If you’re still having trouble submitting your request, call us at{' '}
        <va-telephone contact="8006982411" /> (
        <va-telephone contact="711" tty />
        ). We’re here 24/7. Your in-progress ID is {form.inProgressFormId}.
      </p>
    </va-alert>
  );
};

export default submissionError;
