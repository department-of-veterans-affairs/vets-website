import React from 'react';
import { connect } from 'react-redux';

function IntroductionProcessListV2() {
  return (
    <va-process-list uswds="false">
      <li>
        <h3>Check your eligibility</h3>
        <p>Make sure you meet our eligibility requirements before you apply.</p>
        <va-additional-info trigger="What are the Post-9/11 GI Bill eligibility requirements?">
          <p className="vads-u-margin-top--0">
            <strong>At least one of these must be true:</strong>
          </p>
          <ul className="vads-u-margin-bottom--0">
            <li>
              {' '}
              You served at least 90 days on active duty (either all at once or
              with breaks in service) on or after September 11, 2001,{' '}
              <strong>or</strong>
            </li>
            <li>
              You received a Purple Heart on or after September 11, 2001, and
              were honorably discharged after any amount of service,{' '}
              <strong>or</strong>
            </li>
            <li>
              You served for at least 30 continuous days (all at once, without a
              break in service) on or after September 11, 2001, and were
              honorably discharged with a service-connected disability
            </li>
          </ul>
        </va-additional-info>
      </li>
      <li>
        <h3>Gather your information</h3>
        <p>
          <strong>Here’s what you’ll need to apply</strong>:
        </p>
        <ul>
          <li>Knowledge of your military service history</li>
          <li>Your current address and contact information</li>
        </ul>
      </li>
      <li>
        <h3>Start your application</h3>
        <p>
          We’ll take you through each step of the process. It should take about
          15 minutes.
        </p>
        <va-additional-info trigger="What happens after I apply?">
          <p className="vads-u-margin-top--0">
            After you apply, you may get an automatic decision. If we approve
            your application, you’ll be able to download your Certificate of
            Eligibility (or award letter) right away. If we deny your
            application, you can download your denial letter. We’ll also mail
            you a copy of your decision letter.
          </p>
          <p className="vads-u-margin-bottom--0">
            <strong>Note</strong>: In some cases, we may need more time to make
            a decision. If you don’t get an automatic decision right after you
            apply, you’ll receive a decision letter in the mail in about 30
            days. And we’ll contact you if we need more information.
          </p>
        </va-additional-info>
      </li>
    </va-process-list>
  );
}

export default connect()(IntroductionProcessListV2);
