import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { AUTH_EVENTS } from 'platform/user/authentication/constants';
import recordEvent from 'platform/monitoring/record-event';

export const IdentityVerificationAlert = () => (
  <va-alert status="continue" data-testid="ezr-identity-alert" uswds>
    <h3 slot="headline">
      Please verify your identity before updating your health benefits
      information
    </h3>
    <p>This process should take about 5 to 10 minutes.</p>
    <p>
      <strong>
        If you need more information or help with verifying your identity:
      </strong>
    </p>
    <ul>
      <li>
        <va-link
          href="/resources/verifying-your-identity-on-vagov/"
          text="Read our identity verification FAQs"
        />
      </li>
      <li>
        Or call us at <va-telephone contact={CONTACTS['222_VETS']} />. If you
        have hearing hearing loss, call{' '}
        <va-telephone contact={CONTACTS['711']} tty />. We’re here Monday
        through Friday, 8:00 a.m. to 8:00 p.m.{' '}
        <dfn>
          <abbr title="Eastern Time">ET</abbr>
        </dfn>
        .
      </li>
    </ul>
    <p>
      <a
        href="/verify"
        className="usa-button"
        onClick={() => {
          recordEvent({ event: AUTH_EVENTS.VERIFY });
        }}
      >
        Verify your identity
      </a>
    </p>
  </va-alert>
);

export default IdentityVerificationAlert;
