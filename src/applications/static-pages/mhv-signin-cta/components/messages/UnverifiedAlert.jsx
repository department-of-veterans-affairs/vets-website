import React from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-named-default
import { default as recordEventFn } from '~/platform/monitoring/record-event';
import { CSP_IDS } from '@department-of-veterans-affairs/platform-user/authentication/constants';
import VerifyAlert from '~/platform/user/authorization/components/VerifyAlert';

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
  headerLevel,
  recordEvent = recordEventFn,
  serviceDescription,
  signInService = CSP_IDS.ID_ME,
}) => {
  /**
   * The verify service alert to show a user that is logged in with Login.gov or ID.me.
   */
  const statusLookup =
    {
      [CSP_IDS.ID_ME]: 'verifyIdMe',
      [CSP_IDS.LOGIN_GOV]: 'verifyLoginGov',
    }[signInService] || 'signInEither';

  const headline = serviceDescription
    ? `${headingPrefix} to ${serviceDescription}`
    : headingPrefix;

  recordEvent({
    event: 'nav-alert-box-load',
    action: 'load',
    'alert-box-headline': headline,
    'alert-box-status': statusLookup,
  });

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
