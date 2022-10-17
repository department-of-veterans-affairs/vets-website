import React from 'react';
import PropTypes from 'prop-types';
import { APP_TYPES } from '../utils/helpers';

const AlertCard = ({ appType }) => {
  return (
    <>
      <va-alert
        class="row vads-u-margin-bottom--5"
        status="error"
        data-testid={`balance-card-alert-${
          appType === APP_TYPES.DEBT ? 'debt' : 'copay'
        }`}
      >
        <h2 slot="headline" className="vads-u-font-size--h3">
          We can’t access your{' '}
          {`${appType === APP_TYPES.DEBT ? 'debt' : 'copay'}`} records right now
        </h2>
        <p className="vads-u-font-size--base vads-u-font-family--sans">
          We’re sorry. Information about{' '}
          {`${appType === APP_TYPES.DEBT ? 'debts' : 'copays'}`} you might have
          is unavailable because something went wrong on our end. Please check
          back soon.
        </p>
        <p>
          If you continue having trouble viewing information about your{' '}
          {`${appType === APP_TYPES.DEBT ? 'debts' : 'copays'}`}, email us at{' '}
          <a href="mailto:dmcops.vbaspl@va.gov">dmcops.vbaspl@va.gov</a>.
        </p>
      </va-alert>
    </>
  );
};
AlertCard.propTypes = {
  appType: PropTypes.string,
};

export default AlertCard;
