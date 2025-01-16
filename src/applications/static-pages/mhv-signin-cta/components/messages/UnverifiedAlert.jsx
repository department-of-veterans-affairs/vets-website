import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-named-default
import { default as recordEventFn } from '~/platform/monitoring/record-event';
import VerifyAlert from '~/platform/user/authentication/components/VerifyAlert';

export const headingPrefix = 'Verify your identity';
export const mhvHeadingPrefix = 'You need to sign in with a different account';

/**
 * Alert to show a user that is not verified (LOA1).
 * @property {number} headerLevel the heading level
 */
const UnverifiedAlert = ({
  headerLevel = 2,
  serviceDescription,
  recordEvent = recordEventFn,
}) => {
  const headline = serviceDescription
    ? `${headingPrefix} to ${serviceDescription}`
    : headingPrefix;

  useEffect(
    () => {
      recordEvent({
        event: 'nav-alert-box-load',
        action: 'load',
        'alert-box-headline': headline,
        'alert-box-status': `va-alert-sign-in__verify`,
      });
    },
    [headline, recordEvent],
  );
  return (
    <div data-testid="mhv-unverified-alert">
      <VerifyAlert headingLevel={headerLevel} />
    </div>
  );
};

UnverifiedAlert.propTypes = {
  headerLevel: PropTypes.number,
  recordEvent: PropTypes.func,
  serviceDescription: PropTypes.string,
};

export default UnverifiedAlert;
