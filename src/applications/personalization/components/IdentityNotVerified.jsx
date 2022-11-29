import React from 'react';

import { AUTH_EVENTS } from 'platform/user/authentication/constants';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import recordEvent from '~/platform/monitoring/record-event';

const IdentityNotVerified = ({
  additionalInfoClickHandler = null,
  headline = 'Verify your identity to view your complete profile',
}) => {
  return (
    <>
      <VaAlert status="continue">
        <h2 slot="headline" data-testid="verify-identity-alert-headline">
          {headline}
        </h2>

        <div className="vads-u-margin-bottom--1">
          <p>
            We need to make sure you’re you&#8212;and not someone pretending to
            be you&#8212;before we can give you access to your personal and
            health-related information. This helps to keep your information
            safe, and to prevent fraud and identity theft.
          </p>

          <p className="vads-u-font-weight--bold">
            This one-time process takes about 5-10 minutes.
          </p>

          <a
            className="vads-c-action-link--green"
            href="/verify"
            onClick={() => recordEvent({ event: AUTH_EVENTS.VERIFY })}
          >
            Verify your identity
          </a>
        </div>
      </VaAlert>

      <p className="vads-u-margin-y--4">
        <a
          onClick={additionalInfoClickHandler}
          href="/resources/verifying-your-identity-on-vagov/"
        >
          Learn how to verify your identity on VA.gov
        </a>
      </p>
    </>
  );
};

IdentityNotVerified.propTypes = {
  additionalInfoClickHandler: PropTypes.func,
  headline: PropTypes.string,
};

export default IdentityNotVerified;
