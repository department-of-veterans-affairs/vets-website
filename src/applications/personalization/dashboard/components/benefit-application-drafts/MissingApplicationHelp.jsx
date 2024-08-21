import React from 'react';

const MissingApplicationHelp = () => (
  <va-accordion uswds data-testid="missing-application-help">
    <va-accordion-item
      header="If you can't find your application or form"
      uswds
    >
      <p>
        <span className="vads-u-font-weight--bold">
          If you can’t find a draft application or form
        </span>
        , it may have expired. We only save draft applications and forms for a
        limited time. This helps us protect your personal data. After a draft
        application or form expires, you’ll need to start over.
      </p>
      <p>
        <span className="vads-u-font-weight--bold">
          If you can’t find an application or form you submitted
        </span>
        , that doesn’t mean that we didn’t receive it.
      </p>
      <p>
        We’re offering a new feature for some forms that helps you track those
        forms from the time you submit the form online to when we confirm that
        we’ve received it.
      </p>
      <p>
        We’ll show the status of these select forms here for{' '}
        <span className="vads-u-font-weight--bold">60 days</span> after you
        submit the form:
      </p>
      <ul>
        <li>
          Authorize the release of non-VA medical information to VA (VA Form
          21-4142 & 21-4142a)
        </li>
        <li>
          Submit a lay or witness statement to support a VA claim (VA Form
          21-10210)
        </li>
        <li>
          Request priority processing for an existing claim (VA Form 20-10207)
        </li>
        <li>
          Authorize VA to release your information to a third-party source (VA
          Form 21-0845)
        </li>
        <li>Sign VA claim forms as an alternate signer (VA Form 21-0972)</li>
        <li>Submit an intent to file (VA Form 21-0966)</li>
        <li>
          Request to be a substitute claimant for a deceased claimant (VA Form
          21P-0847)
        </li>
      </ul>
      <p>
        If you have questions about your applications or forms, call us at
        <va-telephone contact="8008271000" /> (
        <va-telephone contact="711" tty />. We’re here Monday through Friday,
        8:00 a.m. to 9:00 p.m. ET.
      </p>
    </va-accordion-item>
  </va-accordion>
);

export default MissingApplicationHelp;
