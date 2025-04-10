import React, { useEffect, useRef } from 'react';
import { format } from 'date-fns';

import scrollTo from 'platform/utilities/ui/scrollTo';
import { waitForRenderThenFocus } from 'platform/utilities/ui';

export const ConfirmationPageView = ({
  submitDate,
  confirmationNumber,
  formNumber,
  childContent = null,
}) => {
  const alertRef = useRef(null);

  useEffect(
    () => {
      if (alertRef?.current) {
        scrollTo('topScrollElement');
        // delay focus for Safari
        waitForRenderThenFocus('h2', alertRef.current);
      }
    },
    [alertRef],
  );

  return (
    <div>
      <div className="print-only">
        <img
          src="https://www.va.gov/img/design/logo/logo-black-and-white.png"
          alt="VA logo"
          width="300"
        />
      </div>
      <va-alert uswds status="success" ref={alertRef}>
        {submitDate && (
          <h2>
            {' '}
            Form Submission started on {format(submitDate, 'MMMM d, yyyy')}
          </h2>
        )}
        <p>Your submission is in progress.</p>
        <p>Your confirmation number is {confirmationNumber}.</p>
      </va-alert>
      <div className="inset">
        <section>
          <h2>What to expect</h2>
          <va-process-list>
            <va-process-list-item header="Now, We’ll confirm that we’ve received your form">
              <p>
                When we receive your form, we’ll send you an email to the email
                address provided
              </p>
            </va-process-list-item>
            <va-process-list-item pending header="Next, we’ll review your form">
              <p>
                If we need more information after reviewing your form, we’ll
                contact you via email.
              </p>
            </va-process-list-item>
          </va-process-list>
        </section>
        <a
          className="vads-c-action-link--green vads-u-margin-bottom--4"
          href={`/representative/representative-form-upload/${formNumber}/introduction`}
        >
          Start a new VA Form {formNumber} submission
        </a>
        <br />
        <a
          className="vads-c-action-link--green vads-u-margin-bottom--4"
          href="/representative/poa-requests"
        >
          Go to POA requests
        </a>
      </div>
      {childContent || null}
    </div>
  );
};
