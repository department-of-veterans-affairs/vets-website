import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import recordEvent from '~/platform/monitoring/record-event';
import CallToActionAlert from '../CallToActionAlert';

const NoMHVAccount = ({
  serviceDescription,
  primaryButtonHandler,
  secondaryButtonHandler,
  recordEventFn = recordEvent,
}) => {
  const heading = `Please create a My HealtheVet account to ${serviceDescription}`;
  useEffect(
    () => {
      recordEventFn({
        event: 'nav-alert-box-load',
        action: 'load',
        'alert-box-headline': heading,
        'alert-box-status': 'warning',
      });
    },
    [heading, recordEventFn],
  );
  const content = {
    heading,
    alertText: (
      <>
        <p>
          You’ll need to create a My HealtheVet account before you can{' '}
          {serviceDescription}
          {serviceDescription.endsWith('online') ? '.' : ' online.'} This
          account is cost-free and secure.
        </p>
        <p>
          <strong>If you already have a My HealtheVet account,</strong> please
          sign out of VA.gov. Then sign in again with your My HealtheVet
          username and password.
        </p>
      </>
    ),
    primaryButtonText: 'Create your free account',
    primaryButtonHandler,
    secondaryButtonText: 'Sign out of VA.gov',
    secondaryButtonHandler,
    status: 'continue',
  };

  return <CallToActionAlert {...content} />;
};

NoMHVAccount.propTypes = {
  serviceDescription: PropTypes.string.isRequired,
  primaryButtonHandler: PropTypes.func.isRequired,
  recordEventFn: PropTypes.func,
};

export default NoMHVAccount;
