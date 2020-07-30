import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

import recordEvent from 'platform/monitoring/record-event';

export default function VerifyPage() {
  return (
    <div className="row">
      <AlertBox
        content={
          <div>
            <h4 className="usa-alert-heading">
              Please verify your identity before continuing to My VA Health
            </h4>
            <p>This process should take about 5 to 10 minutes.</p>
            <p>
              <strong>If you’re applying for the first time</strong>
            </p>
            <p>
              We need to verify your identity so we can help you track the
              status of your application once you’ve submitted it. As soon as
              you’re finished verifying your identity, you can continue to the
              application.
            </p>
            <p>
              <strong>If you’ve applied before</strong>
            </p>
            <p>
              We need to verify your identity so we can show you the status of
              your past application. We take your privacy seriously, and we need
              to make sure we’re sharing your personal information only with
              you.
            </p>
            <p>
              <strong>
                If you need more information or help with verifying your
                identity:
              </strong>
            </p>
            <ul>
              <li>
                <a href="/sign-in-faq/#verifying-your-identity">
                  Read our identity verification FAQs
                </a>
              </li>
              <li>
                Or call us at <a href="tel:+18772228387">877-222-8387</a>. If
                you have hearing loss, call TTY:{' '}
                <a href="tel:8008778339" aria-label="8 0 0. 8 7 7. 8 3 3 9.">
                  800-877-8339
                </a>
                . We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
              </li>
            </ul>
            <a
              className="usa-button-primary va-button-primary"
              href={`/verify${window.location.search}`}
              onClick={() => {
                recordEvent({ event: 'verify-link-clicked' });
              }}
            >
              Verify your identity
            </a>
          </div>
        }
        isVisible
        status="continue"
      />
    </div>
  );
}
