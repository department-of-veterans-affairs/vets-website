import React from 'react';
import PropTypes from 'prop-types';
import { FLOW_TYPES, VASS_PHONE_NUMBER } from '../utils/constants';

const ErrorAlert = ({ flowType = FLOW_TYPES.SCHEDULE }) => {
  const header =
    flowType === FLOW_TYPES.CANCEL
      ? 'We can’t cancel your appointment right now'
      : 'We can’t schedule your appointment right now';
  return (
    <va-alert
      status="error"
      class="vads-u-margin-top--4"
      data-testid="api-error-alert"
    >
      <h2>{header}</h2>
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

ErrorAlert.propTypes = {
  flowType: PropTypes.oneOf(Object.values(FLOW_TYPES)),
};
