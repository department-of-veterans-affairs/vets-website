import React from 'react';

const ProcessList = () => {
  return (
    <va-process-list>
      <va-process-list-item header="Check your eligibility">
        <p>To qualify for the High Technology Program, you must:</p>
        <ul>
          <li>
            Be a Veteran who served at least 36 months of active duty, <b>or</b>{' '}
          </li>
          <li>
            A service member within 180 days of discharge who will have 36
            months by then, <b>and</b>
          </li>
          <li>Have a discharge other than dishonorable.</li>
          <li>Be under age 62 at the time of application</li>
        </ul>
      </va-process-list-item>
      <va-process-list-item header="Gather your information">
        <p>Here’s what you’ll need to apply:</p>
        <ul>
          <li>Your social security number</li>
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
          ten minutes.
        </p>
      </va-process-list-item>
    </va-process-list>
  );
};
export default ProcessList;
