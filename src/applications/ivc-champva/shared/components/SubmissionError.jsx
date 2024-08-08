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
    'alert-box-heading': `${
      form?.formId
    } - Your CHAMPVA submission didn’t go through`,
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
      <h3 slot="headline">We couldn’t submit your form</h3>
      <p>
        We’re sorry. There was a problem with our system. Try submitting your
        form again.
      </p>
      <p>
        If it still doesn’t work, call us at{' '}
        <va-telephone contact="8006982411" /> (
        <va-telephone contact="711" tty />
        ). We’re here 24/7.
      </p>
    </va-alert>
  );
};

SubmissionError.propTypes = {
  form: PropTypes.shape({ formId: PropTypes.string }),
};

export default SubmissionError;
