import React from 'react';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

import { AUTH_EVENTS } from 'platform/user/authentication/constants';
import recordEvent from '~/platform/monitoring/record-event';

const IdentityNotVerified = ({
  alertHeadline,
  alertContent = (
    <p>
      We need to make sure you’re you - and not someone pretending to be you -
      before we can give you access to your personal and health-related
      information. This helps to keep your information safe, and to prevent
      fraud and identity theft.
    </p>
  ),
  additionalInfoClickHandler = null,
  level = 3,
}) => {
  const content = (
    <>
      {alertContent}

      <a
        className="vads-c-action-link--green"
        href="/verify"
        onClick={() => recordEvent({ event: AUTH_EVENTS.VERIFY })}
      >
        Verify your identity
      </a>
    </>
  );

  return (
    <>
      <AlertBox
        headline={alertHeadline}
        content={content}
        status="warning"
        level={level}
      />
      <p>
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

export default IdentityNotVerified;
