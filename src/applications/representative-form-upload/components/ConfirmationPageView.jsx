import React, { useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';

import { scrollTo } from 'platform/utilities/scroll';
import { waitForRenderThenFocus } from 'platform/utilities/ui/focus';

export const ConfirmationPageView = ({
  submitDate,
  benefitType,
  childContent = null,
}) => {
  const form = useSelector(state => state.form || {});
  const { first, last } = form.data.veteranFullName;
  const { city, state, postalCode } = form.data.address;
  const alertRef = useRef(null);

  const formattedSubmitDate =
    submitDate && typeof submitDate === 'object'
      ? format(submitDate, 'MMMM d, yyyy')
      : null;

  const formattedSubmitDateTime =
    submitDate && typeof submitDate === 'object'
      ? format(submitDate, "MMMM d, yyyy 'at' h:mm aaaa 'ET'")
      : null;

  const itfTypes = { compensation: 'Compensation', pension: 'Pension' };

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
      {submitDate && (
        <va-alert status="success" ref={alertRef}>
          <h2 slot="headline">We recorded the intent to file</h2>
          {formattedSubmitDateTime ? (
            <p className="vads-u-margin-y--0">
              Submit the claim by <strong>{formattedSubmitDateTime}</strong> to
              receive payments starting from the effective date.
            </p>
          ) : null}
        </va-alert>
      )}
      <p>This information was recorded for the new intent to file.</p>
      <va-card>
        <h2 className="vads-u-margin--0 vads-u-font-size--h3">
          {last}, {first}
        </h2>
        <div>
          {city}, {state} {postalCode}
        </div>
        <p className="vads-u-margin-bottom--0">
          <div>
            <b>Benefit:</b> {itfTypes[benefitType]}
          </div>
          <div>
            <b>ITF Date:</b> {formattedSubmitDate} (Expires in 365 days)
          </div>
        </p>
      </va-card>
      <section>
        <h2>What to expect</h2>
        <va-process-list>
          <va-process-list-item header="We'll confirm the intent to file was recorded">
            <p>We’ll send you an email with the confirmation.</p>
          </va-process-list-item>
          <va-process-list-item header="Submit the claim prior to ITF expiration date">
            <p>
              You should submit the claim as soon as possible. The intent to
              file for {itfTypes[benefitType]} expires one year from today.
            </p>
          </va-process-list-item>
        </va-process-list>
      </section>
      <va-link-action
        href="/representative/submissions"
        label="Go back to submissions"
        class="vads-u-margin-bottom--4"
        text="Go back to submissions"
        type="primary"
      />
      {childContent || null}
    </div>
  );
};
