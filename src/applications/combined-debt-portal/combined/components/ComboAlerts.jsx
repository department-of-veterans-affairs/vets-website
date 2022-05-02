import React from 'react';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';

const ComboAlert = ({ children }) => children;

ComboAlert.Error = () => {
  return (
    <va-alert
      class="row vads-u-margin-bottom--5"
      status="error"
      data-testid="debt-and-copay-alert-message"
    >
      <h2 slot="headline" className="vads-u-font-size--h3">
        We can’t access your debt and copay records right now
      </h2>
      <p className="vads-u-font-size--base vads-u-font-family--sans">
        We’re sorry. Information about debts and copays you might have is
        unavailable because something went wrong on our end. Please check back
        soon.
      </p>
      <h3 className="vads-u-font-size--h4">What you can do</h3>
      <p>
        If you continue having trouble viewing information about your current
        debts and bills, email us at{' '}
        <a href="mailto:dmcops.vbaspl@va.gov">dmcops.vbaspl@va.gov</a>.
      </p>
    </va-alert>
  );
};

ComboAlert.Zero = () => {
  return (
    <va-alert
      class="row vads-u-margin-bottom--5"
      status="info"
      data-testid="debt-and-copay-zero-alert-message"
    >
      <h2 slot="headline" className="vads-u-font-size--h3">
        You don’t have any current VA debt or copay bills
      </h2>
      <p className="vads-u-font-size--base vads-u-font-family--sans">
        Our records show you don’t have any current VA benefit debt and you
        haven’t received a copay bill in the past 6 months.
      </p>
      <h3 className="vads-u-font-size--h4">
        What to do if you think you have a VA debt or copay bill
      </h3>
      <ul>
        <li>
          <p>
            <strong>For benefit debts</strong>, call the Debt Management Center
            (DMC) at <va-telephone contact="800-827-0648" /> (TTY:{' '}
            <va-telephone contact="711" />
            ). We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET. •
          </p>
        </li>
        <li>
          <p>
            <strong>For medical copay bills</strong>, call the VA Health
            Resource Center at <va-telephone contact="866-400-1238" /> (TTY:{' '}
            <va-telephone contact="711" />
            ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
          </p>
        </li>
      </ul>
    </va-alert>
  );
};

const ComboAlerts = ({ type }) => {
  if (type === 'zero-balances') {
    return <ComboAlert.Zero />;
  }

  recordEvent({
    event: 'alert-card-error',
    'alert-card-error': 'true',
  });
  return <ComboAlert.Error />;
};

ComboAlerts.propTypes = {
  type: PropTypes.string,
};

export default ComboAlerts;
