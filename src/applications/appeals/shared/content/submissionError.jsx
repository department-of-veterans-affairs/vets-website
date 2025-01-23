import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import { scrollTo, focusElement } from 'platform/utilities/ui';
import recordEvent from 'platform/monitoring/record-event';

const SubmissionError = ({ form }) => {
  const alertRef = useRef(null);

  useEffect(
    () => {
      if (alertRef?.current) {
        scrollTo(alertRef.current);
        focusElement('h3', {}, alertRef.current);
      }
    },
    [alertRef],
  );
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
    <va-alert
      ref={alertRef}
      id="submission-error"
      status="error"
      class="vads-u-margin-y--2"
      uswds
    >
      <h3 slot="headline">Your decision review request didn’t go through</h3>
      <p>
        We’re sorry. We’re working to fix the problem, but it may take us a
        while. Your request has been saved. We suggest you try submitting again
        tomorrow.
      </p>
      <p>
        If you’re still having trouble submitting your request, call us at{' '}
        <va-telephone contact="8008271000" /> (
        <va-telephone contact="711" tty />
        ). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m.{' '}
        <dfn>
          <abbr title="Eastern Time">ET</abbr>
        </dfn>
        . Your in-progress ID is {form.inProgressFormId}.
      </p>
    </va-alert>
  );
};

SubmissionError.propTypes = {
  form: PropTypes.shape({
    inProgressFormId: PropTypes.number,
  }),
};

export default SubmissionError;
