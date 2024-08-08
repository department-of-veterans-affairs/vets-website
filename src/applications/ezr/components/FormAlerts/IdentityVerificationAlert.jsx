import React from 'react';
import PropTypes from 'prop-types';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { APP_URLS } from '../../utils/constants';

export const IdentityVerificationAlert = ({ onVerify }) => (
  <va-alert
    status="continue"
    class="vads-u-margin-y--4"
    data-testid="ezr-identity-alert"
    uswds
  >
    <h3 slot="headline">
      Please verify your identity before updating your health benefits
      information
    </h3>
    <div>
      <p>This process should take about 5 to 10 minutes.</p>
      <p className="vads-u-font-weight--bold">
        If you need more information or help with verifying your identity:
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
          className="vads-c-action-link--green"
          onClick={onVerify}
          href={APP_URLS.verify}
        >
          Verify your identity
        </a>
      </p>
    </div>
  </va-alert>
);

IdentityVerificationAlert.propTypes = {
  onVerify: PropTypes.func,
};

export default IdentityVerificationAlert;
