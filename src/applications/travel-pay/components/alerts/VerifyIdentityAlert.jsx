import React from 'react';

import recordEvent from 'platform/monitoring/record-event';
import { AUTH_EVENTS } from 'platform/user/authentication/constants';

import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const VerifyIdentityAlert = () => (
  <va-alert visible closealble="false" status="continue">
    <h2 slot="headline">Verify your identity to access your travel claims</h2>
    <p>This process should take about 5 to 10 minutes.</p>
    <p>
      We need to verify your identity so we can show you the status of your past
      travel claims. We take your privacy seriously, and we need to make sure
      we’re sharing your personal information only with you.
    </p>
    <p>
      <strong>
        If you need more information or help with verifying your identity:
      </strong>
    </p>
    <ul>
      <li>
        <a href="/resources/verifying-your-identity-on-vagov/">
          Read our identity verification FAQs
        </a>
      </li>
      <li>
        Or call us at <va-telephone contact={CONTACTS['222_VETS']} />. If you
        have hearing loss, call <va-telephone contact={CONTACTS.HELP_TTY} tty />
        . We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
      </li>
    </ul>
    <p>
      <va-link-action
        href="/verify"
        text="Verify your identity"
        onClick={() => recordEvent({ event: AUTH_EVENTS.VERIFY })}
      />
    </p>
  </va-alert>
);

export default VerifyIdentityAlert;
