import React from 'react';

const ProcessList = () => {
  return (
    <va-process-list>
      <va-process-list-item header="Check your eligibility">
        <p>To qualify for the VET TEC 2.0 Program, you must:</p>
        <ul>
          <li>
            Be a Veteran who served at least 36 months of active duty upon
            application, <b>or</b>{' '}
          </li>
          <li>
            A service member with 36 months of active duty upon submission and
            be within 180 days of discharge, <b>and</b>
          </li>
          <li>Have a discharge other than dishonorable</li>
          <li>Be at or under 62 years of age at the time of application</li>
        </ul>
      </va-process-list-item>
      <va-process-list-item header="Gather your information">
        <p>Here’s what you’ll need to apply:</p>
        <ul>
          <li>Your current mailing address and contact information</li>
          <li>The date you were or will be released from active duty</li>
          <li>
            Your direct deposit information (bank routing number and account
            number)
          </li>
          <li>
            The names and addresses of the training providers that you wish to
            attend (this information is optional)
          </li>
        </ul>
      </va-process-list-item>
      <va-process-list-item header="Start your application">
        <p>
          We’ll take you through each step of the process. It should take about
          10 minutes.
        </p>
        <va-additional-info trigger="What happens after I apply?">
          <p>
            After you apply, you may get an automatic decision. If we approve
            your application, you’ll be able to download your Certificate of
            Eligibility (or award letter) right away. Please be aware that VET
            TEC 2.0 has an annual student participation limit (October 1 to
            September 30). If you are approved, but the participation limit has
            been met, we may not be able to award you benefits in this fiscal
            year.
          </p>
          <p>
            If we deny your application, you can download your denial letter.
            We’ll also mail you a copy of your decision letter.
          </p>
          <p>
            <b>Note:</b> In some cases, we may need more time to make a
            decision. If you don’t get an automatic decision right after you
            apply, you’ll receive a decision letter in the mail in about 30
            days. And we’ll contact you if we need more information.
          </p>
        </va-additional-info>
      </va-process-list-item>
    </va-process-list>
  );
};
export default ProcessList;
