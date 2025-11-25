import React from 'react';
import { AUTHN_SETTINGS } from '@department-of-veterans-affairs/platform-user/exports';

export default function PortalRemovalNotice() {
  const returnUrl =
    sessionStorage.getItem(AUTHN_SETTINGS.RETURN_URL) || '/my-va';
  return (
    <section className="container row login vads-u-padding--3">
      <div className="columns small-12 vads-u-margin-y--2">
        <h1>Manage your health care for all VA facilities on VA.gov</h1>
        <p>
          We’ve brought all your VA health care data together so you can manage
          your care in one place.
        </p>
        <p>
          You can now manage your care for all facilities through My HealtheVet
          on VA.gov
        </p>
        <ul>
          <li>Refill your VA prescriptions and manage your medications</li>
          <li>Schedule and manage some VA health appointments</li>
          <li>Send secure messages to your VA health care team</li>
          <li>Review your medical records, including lab and test results</li>
          <li>Order some medical supplies</li>
          <li>File travel reimbursement claims</li>
        </ul>
        <va-link-action
          text="Go to My HealtheVet on VA.gov"
          label="Go to My HealtheVet on VA.gov"
          type="primary"
          href="/my-health"
        />
        <h2>Still want to use My VA Health for now?</h2>
        <p>
          You can still access your health information through the My VA Health
          portal if you’d like.
        </p>
        <va-link-action
          text="Go to My VA Health"
          label="Go to My VA Health"
          type="secondary"
          href={returnUrl}
        />
      </div>
    </section>
  );
}
