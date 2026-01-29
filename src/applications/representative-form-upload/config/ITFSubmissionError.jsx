import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import { focusElement } from 'platform/utilities/ui/focus';
import { useSelector } from 'react-redux';
import { scrollTo } from 'platform/utilities/scroll';

const ITFSubmissionError = () => {
  const alertRef = useRef(null);
  const submissionData = useSelector(state => state.form.submission);

  useEffect(
    () => {
      if (alertRef?.current) {
        scrollTo(alertRef.current);
        focusElement('h3', {}, alertRef.current);
      }
    },
    [alertRef],
  );

  if (
    submissionData.errorMessage === 'vets_server_error: Service Unavailable'
  ) {
    return (
      <va-alert
        ref={alertRef}
        id="submission-error"
        status="error"
        class="vads-u-margin-y--2"
        uswds
      >
        <h3 slot="headline">
          The form couldn’t be submitted because of high system traffic
        </h3>
        <p>
          This is a temporary system issue. Try submitting the form again later.
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
  }

  return (
    <>
      <va-alert
        ref={alertRef}
        id="submission-error"
        status="error"
        class="vads-u-margin-y--2"
        uswds
      >
        <h3 slot="headline">The submission couldn’t be completed</h3>
        <p>
          We’re sorry, there was a problem with our system. Try submitting again
          later.
        </p>
        <p>
          You can also call us at <va-telephone contact="8552250709" /> for help
          submitting an intent to file. We’re here Monday through Friday, 8:00
          a.m. to 9:00 p.m. ET.
        </p>
      </va-alert>
      <p className="vads-u-margin-top--4">
        <a
          className="vads-c-action-link--green"
          href="/representative/submissions"
        >
          Go back to submissions page
        </a>
      </p>
    </>
  );
};

ITFSubmissionError.propTypes = {
  form: PropTypes.shape({
    inProgressFormId: PropTypes.number,
  }),
};

export default ITFSubmissionError;
