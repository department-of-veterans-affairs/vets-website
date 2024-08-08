import React from 'react';
import PropTypes from 'prop-types';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { AUTH_EVENTS } from 'platform/user/authentication/constants';
import recordEvent from 'platform/monitoring/record-event';
import { getAppUrl } from '~/platform/utilities/registry-helpers';
import NeedHelp from './NeedHelp';

export const IdentityVerificationAlert = () => {
  const onVerifyEvent = recordEvent({ event: AUTH_EVENTS.VERIFY });
  return (
    <div className="vads-u-margin-top--6 vads-u-margin-bottom--8 vads-l-grid-container large-screen:vads-u-padding-x--0">
      <va-alert
        status="continue"
        class="vads-u-margin-y--4"
        data-testid="ezr-identity-alert"
        uswds
      >
        <h3 slot="headline">
          Please verify your identity before verifying your MGIB enrollments
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
              Or call us at <va-telephone contact={CONTACTS['222_VETS']} />. If
              you have hearing hearing loss, call{' '}
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
              href={getAppUrl('verify')}
              onClick={onVerifyEvent}
            >
              Verify your identity
            </a>
          </p>
        </div>
      </va-alert>
      <p className="vads-u-margin-y--4">
        <va-link
          href="/resources/verifying-your-identity-on-vagov/"
          text="Learn how to verify your identity on VA.gov"
          data-testid="verify-identity-link"
        />
      </p>
      <NeedHelp />
    </div>
  );
};

IdentityVerificationAlert.propTypes = {
  onVerify: PropTypes.func,
};

export default IdentityVerificationAlert;
