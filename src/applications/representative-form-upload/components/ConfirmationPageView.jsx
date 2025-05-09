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
        {submitDate && <h2>You’ve submitted the form</h2>}
        <p>
          You submitted the form and supporting evidence on{' '}
          <strong>{format(submitDate, 'MMMM d, yyyy')}</strong>
        </p>
        <p>Your confirmation number is: {confirmationNumber}.</p>
        <p>We’ve emailed this confirmation number to you for your records.</p>
      </va-alert>
      <div className="inset">
        <section>
          <h2>What to expect</h2>
          <va-process-list>
            <va-process-list-item header="Now, we'll proccess your form">
              <p>
                The submission is in progress and is being proccessed through
                Central Mail before reaching VBMS
              </p>
            </va-process-list-item>
            <va-process-list-item pending header="Next, we'll review the files">
              <p>
                If we need more information after reviewing the form and
                supporting evidence, we’ll contact you by email.
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
