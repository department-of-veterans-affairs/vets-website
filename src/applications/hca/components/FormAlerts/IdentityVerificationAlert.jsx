import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import recordEvent from '~/platform/monitoring/record-event';
import { AUTH_EVENTS } from '~/platform/user/authentication/constants';
import { APP_URLS } from '../../utils/constants';

const IdentityVerificationAlert = () => {
  const onVerify = () => recordEvent({ event: AUTH_EVENTS.VERIFY });
  return (
    <va-alert status="continue" data-testid="hca-identity-alert" uswds>
      <h2 slot="headline">
        Please verify your identity before applying for VA health care
      </h2>
      <p>This process takes about 5 minutes.</p>
      <p>
        <strong>If you’re applying for the first time</strong>
      </p>
      <p>
        We need to verify your identity so we can help you track the status of
        your application once you’ve submitted it. As soon as you’re finished
        verifying your identity, you can continue to the application.
      </p>
      <p>
        <strong>If you’ve applied before</strong>
      </p>
      <p>
        We need to verify your identity so we can show you the status of your
        past application. We take your privacy seriously, and we need to make
        sure we’re sharing your personal information only with you.
      </p>
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
        <a href={APP_URLS.verify} className="usa-button" onClick={onVerify}>
          Verify your identity
        </a>
      </p>
    </va-alert>
  );
};

export default IdentityVerificationAlert;
