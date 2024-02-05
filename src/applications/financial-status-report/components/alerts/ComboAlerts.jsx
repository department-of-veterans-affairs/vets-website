import React from 'react';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { ALERT_TYPES } from '../../constants';

const ComboAlert = ({ children }) => children;

ComboAlert.Error = () => {
  return (
    <va-alert
      uswds
      class="row vads-u-margin-bottom--5"
      status="error"
      data-testid="balance-card-combo-alert-error"
    >
      <h2 slot="headline" className="vads-u-font-size--h3">
        We can’t access your overpayment and copay records right now
      </h2>
      <p className="vads-u-font-size--base vads-u-font-family--sans">
        We’re sorry. Information about benefit overpayment and copays you might
        have is unavailable because something went wrong on our end. Please
        check back soon.
      </p>
      <h3 className="vads-u-font-size--h4">What you can do</h3>
      <p>
        If you continue having trouble viewing information about your current
        overpayments and copay bills, contact us online through{' '}
        <a href="https://ask.va.gov">Ask VA</a>.
      </p>
    </va-alert>
  );
};

ComboAlert.Zero = () => {
  return (
    <va-alert
      uswds
      class="row vads-u-margin-bottom--5"
      status="info"
      data-testid="balance-card-combo-alert-zero"
    >
      <h2 slot="headline" className="vads-u-font-size--h3">
        You don’t have any current overpayments or copay bills
      </h2>
      <p className="vads-u-font-size--base vads-u-font-family--sans">
        Our records show you don’t have any current VA benefit debt and you
        haven’t received a copay bill in the past 6 months.
      </p>
      <h3 className="vads-u-font-size--h4">
        What to do if you think you have an overpayment or copay bill
      </h3>
      <ul>
        <li className="vads-u-font-family--sans">
          <strong>For benefit debts</strong>, call the Debt Management Center
          (DMC) at <va-telephone contact={CONTACTS.DMC} uswds /> (
          <va-telephone contact={CONTACTS['711']} tty uswds />
          ). We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.
        </li>
        <li className="vads-u-font-family--sans">
          <strong>For medical copay bills</strong>, call the VA Resource Center
          at <va-telephone contact="8664001238" uswds /> (
          <va-telephone contact={CONTACTS['711']} tty uswds />
          ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
        </li>
      </ul>
    </va-alert>
  );
};

const ComboAlerts = ({ alertType }) => {
  switch (alertType) {
    case ALERT_TYPES.ZERO:
      return <ComboAlert.Zero />;
    case ALERT_TYPES.ERROR:
    default:
      recordEvent({
        event: 'cdp-alert-card-error',
        'cdp-alert-card-error': 'true',
      });
      return <ComboAlert.Error />;
  }
};

ComboAlerts.propTypes = {
  alertType: PropTypes.string,
};

export default ComboAlerts;
