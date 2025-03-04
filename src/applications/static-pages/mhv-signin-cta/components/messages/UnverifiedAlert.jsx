import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-named-default
import { default as recordEventFn } from '~/platform/monitoring/record-event';
import VerifyAlert from '~/platform/user/authorization/components/VerifyAlert';
import { CSP_IDS } from '@department-of-veterans-affairs/platform-user/authentication/constants';

export const headingPrefix = 'Verify your identity';
export const mhvHeadingPrefix = 'You need to sign in with a different account';

/**
 * Alert to show a user that is not verified (LOA1).
 * @property {number} headerLevel the heading level
 * @property {*} recordEvent the function to record the event
 * @property {string} serviceDescription optional description of the service that requires verification
 * @property {string} signInService the ID of the sign in service
 */
const UnverifiedAlert = ({
  headerLevel = 3,
  recordEvent = recordEventFn,
  serviceDescription,
  signInService = CSP_IDS.ID_ME,
}) => {
  const statusLookup =
    {
      [CSP_IDS.ID_ME]: 'verifyIdMe',
      [CSP_IDS.LOGIN_GOV]: 'verifyLoginGov',
    }[signInService] || 'signInEither';

  const headline = serviceDescription
    ? `${headingPrefix} to ${serviceDescription}`
    : headingPrefix;

  useEffect(
    () => {
      recordEvent({
        event: 'nav-alert-box-load',
        action: 'load',
        'alert-box-headline': headline,
        'alert-box-status': statusLookup,
      });
    },
    [headline, recordEvent, statusLookup],
  );

  return (
    <div data-testid="mhv-unverified-alert">
      <VerifyAlert headingLevel={headerLevel} />
    </div>
  );
};

UnverifiedAlert.propTypes = {
  signInService: PropTypes.string.isRequired,
  headerLevel: PropTypes.number,
  recordEvent: PropTypes.func,
  serviceDescription: PropTypes.string,
};

export default UnverifiedAlert;
