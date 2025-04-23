import React from 'react';
import PropTypes from 'prop-types';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
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
        <p>
          We’re sorry. Information about{' '}
          {`${appType === APP_TYPES.DEBT ? 'debts' : 'copays'}`} you might have
          is unavailable because something went wrong on our end. Please check
          back soon.
        </p>
        <h3 className="vads-u-font-size--h4">What you can do</h3>
        {appType === APP_TYPES.DEBT ? (
          <>
            <p className="vads-u-margin-bottom--0">
              If you continue having trouble viewing information about your
              current debts, contact us online through{' '}
              <a href="https://ask.va.gov">Ask VA</a>.
            </p>
            <p className="vads-u-margin-top--0">
              If you need immediate assistance call the Debt Management Center
              at <va-telephone contact={CONTACTS.DMC} /> (
              <va-telephone contact={CONTACTS[711]} tty />
              ). For international callers, use{' '}
              <va-telephone contact={CONTACTS.DMC_OVERSEAS} international />.
              We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.
            </p>
          </>
        ) : (
          <p>
            If you continue having trouble viewing information about your
            copays, call the VA Health Resource Center at{' '}
            <va-telephone contact={CONTACTS.HEALTH_RESOURCE_CENTER} /> (
            <va-telephone contact={CONTACTS[711]} tty />
            ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
          </p>
        )}
      </va-alert>
    </>
  );
};
AlertCard.propTypes = {
  appType: PropTypes.string,
};

export default AlertCard;
