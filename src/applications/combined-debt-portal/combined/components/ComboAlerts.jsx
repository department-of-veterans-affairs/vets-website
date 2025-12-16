import React from 'react';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';
import {
  ALERT_TYPES,
  healthResourceCenterPhoneContent,
  dmcPhoneContent,
} from '../utils/helpers';
import ZeroDebtsCopaysSection from './ZeroDebtsCopaysSection';

const ComboAlert = ({ children }) => children;

ComboAlert.Error = () => {
  return (
    <va-alert
      class="row vads-u-margin-y--4"
      status="error"
      data-testid="balance-card-combo-alert-error"
    >
      <h2 slot="headline">
        We can’t access your overpayment and copay records right now
      </h2>
      <p>We’re sorry. Something went wrong on our end. Check back soon</p>
      <h3 className="vads-u-font-size--h4">What to do if you need help now</h3>
      <ul>
        <li>
          <strong>For benefit overpayments</strong>, call the Debt Management
          Center at {dmcPhoneContent()}
        </li>
        <li>
          <strong>For medical copay bills</strong>, call the VA Health Resource
          Center at {healthResourceCenterPhoneContent()}
        </li>
      </ul>
      <p className="vads-u-margin-bottom--0">
        <va-link active text="Contact us at Ask VA" url="https://ask.va.gov" />
      </p>
    </va-alert>
  );
};

ComboAlert.Zero = () => {
  return (
    <va-alert
      class="row vads-u-margin-bottom--5"
      status="info"
      data-testid="balance-card-combo-alert-zero"
    >
      <h2 slot="headline">
        You don’t have any outstanding overpayments or copay bills
      </h2>
      <p>
        Our records show you don’t have any outstanding overpayments related to
        VA benefits and you haven’t received a copay bill in the past 6 months.
      </p>
      <h3 className="vads-u-font-size--h4">
        What to do if you think you have an overpayment or copay bill:
      </h3>
      <ul>
        <li>
          <strong>For overpayments</strong>, call the Debt Management Center at{' '}
          {dmcPhoneContent()}
        </li>
        <li>
          <strong>For medical copay bills</strong>, call the VA Health Resource
          Center at {healthResourceCenterPhoneContent()}
        </li>
      </ul>
      <p className="vads-u-margin-bottom--0">
        <va-link active text="Return to VA.gov" url="https://va.gov" />
      </p>
    </va-alert>
  );
};

const ComboAlerts = ({ alertType }) => {
  switch (alertType) {
    case ALERT_TYPES.ZERO:
      return <ZeroDebtsCopaysSection />;
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
