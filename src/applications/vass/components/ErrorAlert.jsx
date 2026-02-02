import React from 'react';
import { VASS_PHONE_NUMBER } from '../utils/constants';

const ErrorAlert = () => {
  return (
    <va-alert
      status="error"
      class="vads-u-margin-top--4"
      data-testid="api-error-alert"
    >
      <h2>We can’t schedule your appointment right now</h2>
      <p>
        We’re sorry. There’s a problem with our system. Refresh this page to
        start over or try again later.{' '}
      </p>
      <p>
        If you need to schedule now, call us at{' '}
        <va-telephone contact={VASS_PHONE_NUMBER} />.
      </p>
    </va-alert>
  );
};

export default ErrorAlert;
