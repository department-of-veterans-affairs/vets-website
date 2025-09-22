import React from 'react';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { ALERT_TYPES } from '../utils/helpers';

const ComboAlert = ({ children }) => children;

ComboAlert.Error = () => {
  return (
    <va-alert
      class="row vads-u-margin-y--4"
      status="error"
      data-testid="balance-card-combo-alert-error"
    >
      <h2 slot="headline">
        We can’t access your debt and copay records right now
      </h2>
      <p>
        We’re sorry. Information about debts and copays you might have is
        unavailable because something went wrong on our end. Please check back
        soon.
      </p>
      <h3 className="vads-u-font-size--h4">What you can do</h3>
      <p>
        If you continue having trouble viewing information about your current
        debts and bills, contact us online through{' '}
        <a href="https://ask.va.gov">Ask VA</a>.
      </p>
      <p>
        If you need immediate assistance with overpayment debt, call the Debt
        Management Center at <va-telephone contact={CONTACTS.DMC} /> (
        <va-telephone contact={CONTACTS[711]} tty />
        ). For international callers, use{' '}
        <va-telephone contact={CONTACTS.DMC_OVERSEAS} international />. We’re
        here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.
      </p>
      <p>
        If you need immediate assistance with copay bills, call the VA Health
        Resource Center at{' '}
        <va-telephone contact={CONTACTS.HEALTH_RESOURCE_CENTER} /> (
        <va-telephone contact={CONTACTS[711]} tty />
        ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
      </p>
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
      <h2 slot="headline" className="vads-u-font-size--h3">
        You don’t have any current VA debt or copay bills
      </h2>
      <p>
        Our records show you don’t have any current VA benefit debt and you
        haven’t received a copay bill in the past 6 months.
      </p>
      <h3 className="vads-u-font-size--h4">
        What to do if you think you have a VA debt or copay bill:
      </h3>
      <ul>
        <li>
          <strong>For benefit debts</strong>, call the Debt Management Center
          (DMC) at <va-telephone contact={CONTACTS.DMC} /> (
          <va-telephone tty contact="711" />
          ). We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.
        </li>
        <li>
          <strong>For medical copay bills</strong>, call the VA Health Resource
          Center at <va-telephone contact={CONTACTS.HEALTH_RESOURCE_CENTER} />(
          <va-telephone tty contact="711" />
          ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
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
      return (
        <>
          <h3>You don’t have any current VA debt or copay bills</h3>
          <p>
            Our records show you don’t have any current VA benefit debt and you
            haven’t received a copay bill in the past 6 months.
          </p>
          <h3>What to do if you think you have a VA debt or copay bill</h3>
          <div>
            <p>
              For benefit debts, call the Debt Management Center (DMC) at{' '}
              <va-telephone contact={CONTACTS.DMC} /> (
              <va-telephone tty contact="711" />
              ). We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.
            </p>
            <p>
              For medical copay bills, call the VA Health Resource Center at{' '}
              <va-telephone contact={CONTACTS.HEALTH_RESOURCE_CENTER} /> (
              <va-telephone contact={CONTACTS[711]} tty />
              ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
            </p>{' '}
            <va-link
              active
              class="vads-u-margin-top--2"
              data-testid="return-to-va-link"
              href="https://va.gov"
              text="Return to VA.gov"
            />
          </div>
        </>
      );
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
