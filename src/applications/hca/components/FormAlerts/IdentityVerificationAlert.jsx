import React from 'react';
import PropTypes from 'prop-types';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const IdentityVerificationAlert = ({ onVerify }) => (
  <va-alert status="continue" data-testid="hca-identity-alert">
    <h4 slot="headline">
      Please verify your identity before applying for VA health care
    </h4>
    <p>This process should take about 5 to 10 minutes.</p>
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
      We need to verify your identity so we can show you the status of your past
      application. We take your privacy seriously, and we need to make sure
      we’re sharing your personal information only with you.
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
      <a href="/verify" className="usa-button" onClick={onVerify}>
        Verify your identity
      </a>
    </p>
  </va-alert>
);

IdentityVerificationAlert.propTypes = {
  onVerify: PropTypes.func,
};

export default IdentityVerificationAlert;
