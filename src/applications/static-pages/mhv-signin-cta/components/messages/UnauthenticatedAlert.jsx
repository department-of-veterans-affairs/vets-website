import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
// eslint-disable-next-line import/no-named-default
import { default as recordEventFn } from '~/platform/monitoring/record-event';
import { toggleLoginModal } from '@department-of-veterans-affairs/platform-site-wide/actions';

export const headingPrefix = 'Sign in with a verified account';

/**
 * Alert to show a user that is not logged in.
 * @property {number} headerLevel the heading level
 * @property {*} recordEvent the function to record the event
 * @property {string} serviceDescription the description of the service that requires verification
 */
const UnauthenticatedAlert = ({
  headerLevel = 3,
  recordEvent = recordEventFn,
  serviceDescription,
}) => {
  const headline = serviceDescription
    ? `${headingPrefix} to ${serviceDescription}`
    : headingPrefix;

  const dispatch = useDispatch();
  const handleSignIn = () => {
    dispatch(toggleLoginModal(true, 'mhv-signin-cta', true));
  };

  useEffect(
    () => {
      recordEvent({
        event: 'nav-alert-box-load',
        action: 'load',
        'alert-box-headline': headline,
        'alert-box-status': 'signInRequired',
      });
    },
    [headline, recordEvent],
  );

  return (
    <div data-testid="mhv-unauthenticated-alert">
      <va-alert-sign-in
        heading-level={headerLevel}
        variant="signInRequired"
        visible
      >
        <span slot="SignInButton">
          <va-button
            onClick={handleSignIn}
            text="Sign in or create an account"
          />
        </span>
      </va-alert-sign-in>
    </div>
  );
};

UnauthenticatedAlert.propTypes = {
  headerLevel: PropTypes.number,
  recordEvent: PropTypes.func,
  serviceDescription: PropTypes.string,
};

export default UnauthenticatedAlert;
