import React from 'react';

import { formatDateTime } from '../../../util/dates';

const ConfirmationPage = () => {
  // TODO: Remove placeholder data when wired up
  const data = {
    localStartTime: '2025-03-20T16:30:00.000-08:00',
    location: {
      attributes: {
        name: 'Fort Collins VA Clinic',
      },
    },
  };

  const [formattedDate, formattedTime] = formatDateTime(data.localStartTime);

  return (
    <>
      <h1>We’re processing your travel reimbursement claim</h1>
      <va-alert status="success" visible>
        <h2 slot="headline">Claim submitted</h2>
        <p className="vads-u-margin-y--0">Claim number: #######</p>
        <p>
          This claim is for your appointment{' '}
          {data.location?.attributes?.name
            ? `at ${data.location.attributes.name}`
            : ''}{' '}
          {data.practitionerName ? `with ${data.practitionerName}` : ''} on{' '}
          {formattedDate} at {formattedTime}.
        </p>
      </va-alert>

      <h2 className="vads-u-margin-top--4">Print this confirmation page</h2>
      <p>
        If you’d like to keep a copy of the information on this page, you can
        print it now.
      </p>
      <va-button
        text="Print this page for your records"
        onClick={() => window.print()}
        uswds
      />

      <h2>What happens next</h2>
      <va-process-list>
        <va-process-list-item header="VA will review your claim">
          <p>
            You can check the status of this claim or review all your travel
            claims on your travel reimbursement claims page.
          </p>
          <va-link
            href="/my-health/travel-pay/claims/"
            text="Check your travel reimbursement claim status"
          />
        </va-process-list-item>
        <va-process-list-item header="If your claim is approved, you’ll receive reimbursement via direct deposit">
          <p>
            You must have direct deposit set up in order to receive your funds.
            Direct deposit for travel pay is different than the direct deposit
            used for other VA claims. If you’ve already set up direct deposit
            for travel reimbursement, no additional steps are needed.
          </p>
          <va-link
            href="/resources/how-to-set-up-direct-deposit-for-va-travel-pay-reimbursement/"
            text="Set up direct deposit"
          />
        </va-process-list-item>
      </va-process-list>

      <va-link-action
        text="Submit another travel reimbursement claim"
        href="/my-health/appointments/past"
      />

      <h2 className="vads-u-margin-top--4">
        How to contact us if you have questions
      </h2>
      <p>
        Call us at <va-telephone contact="8555747292" /> (
        <va-telephone tty contact="711" />
        ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
      </p>
      <p>
        Or you can ask us a question online through Ask VA. Select the category
        and topic for the VA benefit this form is related to.
      </p>
      <va-link
        href="https://ask.va.gov/"
        text="Contact us online through Ask VA"
      />
    </>
  );
};

export default ConfirmationPage;
