import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import { focusElement } from 'platform/utilities/ui/focus';
import { scrollTo } from 'platform/utilities/scroll';
import recordEvent from 'platform/monitoring/record-event';

const SubmissionError = () => {
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
      <h3 slot="headline">The form can’t be submitted</h3>
      <p>
        Confirm that you or your Veterans Service Organization (VSO) has
        established POA with the claimant. If not, ask the claimant to appoint
        you as their representative using online{' '}
        <a href="https://www.va.gov/get-help-from-accredited-representative/appoint-rep/introduction/">
          VA Form 21-22.
        </a>{' '}
        Once POA is established, you can restart the submission of this form.
      </p>
      <p>
        If you’re sure that POA is established, it may be that our system has
        not yet updated your POA information. Please try again tomorrow.
      </p>
      <p>
        <a
          className="vads-c-action-link--green"
          href="/representative/submissions"
        >
          Go back to submissions page
        </a>
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
