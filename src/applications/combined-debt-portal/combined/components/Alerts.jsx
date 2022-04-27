import React from 'react';
import PropTypes from 'prop-types';

const Alerts = ({ isDebt }) => {
  return (
    <>
      <va-alert
        class="row vads-u-margin-bottom--5"
        status="error"
        data-testid={`${isDebt ? 'debt' : 'copay'}-alert-message`}
      >
        <h2 slot="headline" className="vads-u-font-size--h3">
          We can’t access your {`${isDebt ? 'debt' : 'copay'}`} records right
          now
        </h2>
        <p className="vads-u-font-size--base vads-u-font-family--sans">
          We’re sorry. Information about {`${isDebt ? 'debts' : 'copays'}`} you
          might have is unavailable because something went wrong on our end.
          Please check back soon.
        </p>
        <p>
          If you continue having trouble viewing information about your{' '}
          {`${isDebt ? 'debts' : 'copays'}`}, email us at{' '}
          <a href="mailto:dmcops.vbaspl@va.gov">dmcops.vbaspl@va.gov</a>.
        </p>
      </va-alert>
    </>
  );
};
Alerts.propTypes = {
  isDebt: PropTypes.bool,
};

export default Alerts;
